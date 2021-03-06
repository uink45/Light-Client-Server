/// <reference types="yargs" />
import { IBeaconNodeOptions } from "@chainsafe/lodestar";
import { RecursivePartial } from "@chainsafe/lodestar-utils";
import * as api from "./api";
import * as chain from "./chain";
import * as eth1 from "./eth1";
import * as execution from "./execution";
import * as logger from "./logger";
import * as metrics from "./metrics";
import * as network from "./network";
import * as sync from "./sync";
export declare type IBeaconNodeArgs = api.IApiArgs & chain.IChainArgs & eth1.IEth1Args & execution.ExecutionEngineArgs & logger.ILoggerArgs & metrics.IMetricsArgs & network.INetworkArgs & sync.ISyncArgs;
export declare function parseBeaconNodeArgs(args: IBeaconNodeArgs): RecursivePartial<IBeaconNodeOptions>;
export declare const beaconNodeOptions: {
    "sync.isSingleNode": import("yargs").Options;
    "sync.disableProcessAsChainSegment": import("yargs").Options;
    "sync.backfillBatchSize": import("yargs").Options;
    "network.discv5.enabled": import("yargs").Options;
    "network.discv5.bindAddr": import("yargs").Options;
    "network.discv5.bootEnrs": import("yargs").Options;
    "network.maxPeers": import("yargs").Options;
    "network.targetPeers": import("yargs").Options;
    "network.bootMultiaddrs": import("yargs").Options;
    "network.localMultiaddrs": import("yargs").Options;
    "network.subscribeAllSubnets": import("yargs").Options;
    "network.connectToDiscv5Bootnodes": import("yargs").Options;
    "network.discv5FirstQueryDelayMs": import("yargs").Options;
    "network.requestCountPeerLimit": import("yargs").Options;
    "network.blockCountTotalLimit": import("yargs").Options;
    "network.blockCountPeerLimit": import("yargs").Options;
    "network.rateTrackerTimeoutMs": import("yargs").Options;
    "network.dontSendGossipAttestationsToForkchoice": import("yargs").Options;
    "metrics.enabled": import("yargs").Options;
    "metrics.gatewayUrl": import("yargs").Options;
    "metrics.serverPort": import("yargs").Options;
    "metrics.timeout": import("yargs").Options;
    "metrics.listenAddr": import("yargs").Options;
    "execution.urls": import("yargs").Options;
    "execution.timeout": import("yargs").Options;
    "jwt-secret": import("yargs").Options;
    "eth1.enabled": import("yargs").Options;
    "eth1.providerUrl": import("yargs").Options;
    "eth1.providerUrls": import("yargs").Options;
    "eth1.depositContractDeployBlock": import("yargs").Options;
    "eth1.disableEth1DepositDataTracker": import("yargs").Options;
    "eth1.unsafeAllowDepositDataOverwrite": import("yargs").Options;
    "chain.blsVerifyAllMultiThread": import("yargs").Options;
    "chain.blsVerifyAllMainThread": import("yargs").Options;
    "chain.disableBlsBatchVerify": import("yargs").Options;
    "chain.persistInvalidSszObjects": import("yargs").Options;
    "chain.proposerBoostEnabled": import("yargs").Options;
    "safe-slots-to-import-optimistically": import("yargs").Options;
    "api.maxGindicesInProof": import("yargs").Options;
    "api.rest.api": import("yargs").Options;
    "api.rest.cors": import("yargs").Options;
    "api.rest.enabled": import("yargs").Options;
    "api.rest.host": import("yargs").Options;
    "api.rest.port": import("yargs").Options;
};
//# sourceMappingURL=index.d.ts.map