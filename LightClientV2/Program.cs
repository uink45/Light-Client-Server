﻿using System;
using System.Net.Http;
using System.IO;
using System.Linq;
using Nethermind.Core2.Containers;
using Nethermind.Core2.Types;
using System.Collections.Generic;
using System.Threading.Tasks;
using Nethermind.Core2.Crypto;

namespace LightClientV2
{
    public class Program 
    {   
        public static LightClientFunctions Client;
        public static LightClientUtility Utility;
        public static LocalClock Clock;
        public static Server Server;
        public static bool NextSyncCommitteeReady;

        public static void InitializeObjects()
        {
            Console.Clear();
            Client = new LightClientFunctions();
            Utility = new LightClientUtility();
            Clock = new LocalClock();
            Server = new Server();
            NextSyncCommitteeReady = false;
        }

        public static async Task Main(string[] args)
        {
            InitializeObjects();
            CheckSyncPeriod();
            await InitializeLightClient();
            await FetchUpdates();
        }

        public static async Task InitializeLightClient()
        {
            while (true)
            {
                string checkpointRoot = await Server.FetchCheckpointRoot();
                if(checkpointRoot != null)
                {
                    LightClientSnapshot snapshot = await Server.FetchFinalizedSnapshot(checkpointRoot);
                    if(snapshot != null)
                    {
                        Client.ValidateCheckpoint(snapshot);
                        Console.WriteLine("Synced");
                        break;
                    }              
                }                   
            }
        }

        public static async Task FetchUpdates()
        {
            LightClientUpdate update = await Server.FetchHeader();
            if (update != null)
            {
                Client.ProcessLightClientUpdate(Client.storage, update, Clock.CurrentSlot(), Utility.ConvertHexStringToRoot("0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95"));
            }
            //while (true)
            //{
            //    try
            //    {
            //        await Task.Delay(11900);
            //        if (NextSyncCommitteeReady & CheckSyncPeriod())
            //        {
            //            LightClientUpdate update = await Server.FetchLightClientUpdate(Clock.SyncPeriodAtEpoch().ToString());
            //            if (update != null)
            //            {
            //                Client.ProcessLightClientUpdate(Client.storage, update, Clock.CurrentSlot(), Utility.ConvertHexStringToRoot("0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95"));
            //            }
            //        }
            //        else
            //        {
            //            LightClientUpdate update = await Server.FetchHeader();
            //            if (update != null)
            //            {
            //                Client.ProcessLightClientUpdate(Client.storage, update, Clock.CurrentSlot(), Utility.ConvertHexStringToRoot("0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95"));
            //            }
            //        }
            //    }
            //    catch (Exception e)
            //    {

            //    }
            //}
        }

        public static bool CheckSyncPeriod()
        {
            
            if (Clock.EpochsInPeriod() == 255 & !NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = true;
                return true;
            }
            else if(Clock.EpochsInPeriod() > 255 & NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = false;
            }
            return false;
        }
    }
}
