﻿using System;
using System.Linq;
using Nethermind.Core2.Types;
using Nethermind.Core2.Containers;
using Nethermind.Core2.Crypto;

namespace Lantern
{
    public class CoreSpec
    {
        public LightClientUtility utility;
        public LightClientStore storage;
        public DataManager data;
        public Constants constants;
        public TimeParameters time;
        public Logging logging;

        public CoreSpec()
        {
            utility = new LightClientUtility();
            storage = new LightClientStore();
            data = new DataManager();
            constants = new Constants();
            time = new TimeParameters();
            logging = new Logging();
        }

        public void ValidateCheckpoint(LightClientSnapshot snapshot)
        {
            // Verify the current sync committee branch
            var isValid = utility.IsValidMerkleBranch(
                   snapshot.CurrentSyncCommittee.HashTreeRoot(),
                   snapshot.CurrentSyncCommitteeBranch,
                   constants.CurrentSyncCommitteeDepth,
                   (ulong)constants.CurrentSyncCommitteeIndex,
                   snapshot.FinalizedHeader.StateRoot);

            if (!isValid)
            {
                throw new Exception("Invalid next sync committee merkle branch");
            }
            storage.CurrentSyncCommittee = snapshot.CurrentSyncCommittee;
            storage.FinalizedHeader = snapshot.FinalizedHeader;
            data.StoreData(storage);
        }

        public void ProcessSlotForLightClientStore(LightClientStore store, Slot currentSlot)
        {
            if((currentSlot % time.UpdateTimeout) == 0)
            {
                store.PreviousMaxActiveParticipants = store.CurrentMaxActiveParticipants;
                store.CurrentMaxActiveParticipants = 0;
            }
            if(currentSlot > (store.FinalizedHeader.Slot + time.UpdateTimeout) & (store.BestValidUpdate != null || store.BestValidUpdate != new LightClientUpdate()))
            {
                ApplyLightClientUpdate(store, store.BestValidUpdate);
                store.BestValidUpdate = new LightClientUpdate();
            }
        }

        public void ValidateLightClientUpdate(LightClientStore store, LightClientUpdate update, Slot currentSlot, Root genesisValidatorsRoot)
        {
            BeaconBlockHeader activeHeader = GetActiveHeader(update);

            if (!(currentSlot >= activeHeader.Slot & activeHeader.Slot > store.FinalizedHeader.Slot))
            {
                logging.SelectLogsType("Warn", 0, $"Received a block (at slot {activeHeader.Slot}) that is older than the stored block ({store.FinalizedHeader.Slot}).");
            }

            Epoch finalizedPeriod = new Epoch((ulong)Math.Floor((decimal)((ulong)utility.ComputeEpochAtSlot(store.FinalizedHeader.Slot) / time.EpochsPerSyncCommitteePeriod)));
            Epoch updatePeriod = new Epoch((ulong)Math.Floor((decimal)((ulong)utility.ComputeEpochAtSlot(activeHeader.Slot) / time.EpochsPerSyncCommitteePeriod)));
            Epoch newPeriod = finalizedPeriod + new Epoch(1);
            Console.WriteLine(updatePeriod.ToString());
            Console.WriteLine(finalizedPeriod.ToString());
            if (updatePeriod != finalizedPeriod & updatePeriod != newPeriod)
            {
                throw new ArgumentOutOfRangeException("Finalized Period", finalizedPeriod, $"Update skips a sync committee period.");
            }

            if(update.FinalizedHeader == new BeaconBlockHeader(Root.Zero) || update.FinalizedHeader == null)
            {
                utility.assertZeroHashes(update.FinalityBranch, constants.FinalizedRootDepth, "finalityBranches");
            }
            else
            {
                var isValid = utility.IsValidMerkleBranch(
                    update.AttestedHeader.HashTreeRoot(), 
                    update.FinalityBranch,
                    constants.FinalizedRootDepth,
                    (ulong)constants.FinalizedRootIndex,
                    update.FinalizedHeader.StateRoot);

                if (!isValid)
                {
                    throw new Exception("Invalid finality header merkle branch");
                }
            }
            
            SyncCommittee syncCommittee;
            if(updatePeriod == finalizedPeriod)
            {
                syncCommittee = store.CurrentSyncCommittee;
                utility.assertZeroHashes(update.NextSyncCommitteeBranch, constants.NextSyncCommitteeDepth, "nextSyncCommitteeBranch");
            }
            else
            {
                syncCommittee = store.NextSyncCommittee;
                var isValid = utility.IsValidMerkleBranch(
                    update.NextSyncCommittee.HashTreeRoot(),
                    update.NextSyncCommitteeBranch,
                    constants.NextSyncCommitteeDepth,
                    (ulong)constants.NextSyncCommitteeIndex,
                    update.AttestedHeader.StateRoot);

                if (!isValid)
                {
                    throw new Exception("Invalid next sync committee merkle branch");
                }
            }

            SyncAggregate syncAggregate = update.SyncAggregate;
            int committeeParticipantsSum = syncAggregate.SyncCommitteeBits.Cast<bool>().Count(l => l);
            
            if(!(committeeParticipantsSum >= constants.MinSyncCommitteeParticipants))
            {
                throw new Exception("Sync committee does not have sufficient participants");
            }

            BlsPublicKey[] publicKeys = utility.GetParticipantPubkeys(syncCommittee.PublicKeys, syncAggregate.SyncCommitteeBits);
            BlsPublicKey aggregatePublicKey = utility.Crypto.BlsAggregatePublicKeys(publicKeys);
            Domain domain = utility.ComputeDomain(new SignatureDomains().DomainSyncCommittee, update.ForkVersion, genesisValidatorsRoot);
            Root signingRoot = utility.ComputeSigningRoot(update.AttestedHeader.HashTreeRoot(), domain); 
            
            var Valid = utility.Crypto.BlsVerify(aggregatePublicKey, signingRoot, syncAggregate.SyncCommitteeSignature);

            if (!Valid)
            {
                throw new Exception("\nInvalid aggregate signature");
            }         
        }

        public void ApplyLightClientUpdate(LightClientStore store, LightClientUpdate update)
        {
            BeaconBlockHeader activeHeader = GetActiveHeader(update);
            Epoch finalizedPeriod = new Epoch((ulong)Math.Floor((decimal)((ulong)utility.ComputeEpochAtSlot(store.FinalizedHeader.Slot) / time.EpochsPerSyncCommitteePeriod)));
            Epoch updatePeriod = new Epoch((ulong)Math.Floor((decimal)((ulong)utility.ComputeEpochAtSlot(activeHeader.Slot) / time.EpochsPerSyncCommitteePeriod)));
            if (updatePeriod == (finalizedPeriod + new Epoch(1)))
            {
                store.CurrentSyncCommittee = store.NextSyncCommittee;
                store.NextSyncCommittee = update.NextSyncCommittee;
            }
            store.FinalizedHeader = activeHeader;
            storage = store;
        }

        public void ProcessLightClientUpdate(LightClientStore store, LightClientUpdate update, Slot currentSlot, Root genesisValidatorsRoot)
        {

            ValidateLightClientUpdate(store, update, currentSlot, genesisValidatorsRoot);
            
            int updateSyncCommitteeBits = update.SyncAggregate.SyncCommitteeBits.Cast<bool>().Count(l => l);
            int bestSyncCommitteeBits = store.BestValidUpdate.SyncAggregate.SyncCommitteeBits.Cast<bool>().Count(l => l);
            
            if ((store.BestValidUpdate == new LightClientUpdate() || store.BestValidUpdate == null) || (updateSyncCommitteeBits > bestSyncCommitteeBits))
            {
                store.BestValidUpdate = update;
            }

            store.CurrentMaxActiveParticipants = Math.Max(store.CurrentMaxActiveParticipants, updateSyncCommitteeBits);

            if(updateSyncCommitteeBits > GetSafetyThreshold(store) & update.AttestedHeader.Slot > store.OptimisticHeader.Slot)
            {
                store.OptimisticHeader = update.AttestedHeader;
            }

            if(((updateSyncCommitteeBits * 3) >= update.SyncAggregate.SyncCommitteeBits.Length * 2) & (update.FinalizedHeader != new BeaconBlockHeader(Root.Zero) || update.FinalizedHeader != null))
            {
                ApplyLightClientUpdate(store, update);
                store.BestValidUpdate = new LightClientUpdate();
            }
            data.StoreData(storage);
        }

        public int GetSafetyThreshold(LightClientStore store)
        {
            return Math.Max(store.PreviousMaxActiveParticipants, store.CurrentMaxActiveParticipants);
        }

        public BeaconBlockHeader GetActiveHeader(LightClientUpdate update)
        {
            if(update.FinalizedHeader != null)
            {
                return update.FinalizedHeader;
            }
            return update.AttestedHeader;
        }

        public ulong GetSubTreeIndex(ulong generalizedIndex, ulong generalizedIndexLog2)
        {
            return generalizedIndex % ((ulong)((2 << (int)generalizedIndexLog2) / 2));
        }
    }
}
