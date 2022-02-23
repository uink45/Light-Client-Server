const ProtocolPrefix = "/eth2/beacon_chain/req";
exports.ProtocolPrefix = ProtocolPrefix;

const Method = {
    Status: "status",
    Goodbye: "goodbye",
    Ping: "ping",
    Metadata: "metadata",
    BeaconBlocksByRange: "beacon_blocks_by_range",
    BeaconBlocksByRoot: "beacon_blocks_by_root"
}
exports.Method = Method;

const Version = {
    V1: "1",
    V2: "2"
}
exports.Version = Version;

const Encoding = {
    SSZ_SNAPPY: "ssz_snappy",
}
exports.Encoding = Encoding;

const ProtocolsSupported = [[
    [Method.Status, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.Goodbye, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.Ping, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.Metadata, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.Metadata, Version.V2, Encoding.SSZ_SNAPPY],
    [Method.BeaconBlocksByRange, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.BeaconBlocksByRange, Version.V2, Encoding.SSZ_SNAPPY],
    [Method.BeaconBlocksByRoot, Version.V1, Encoding.SSZ_SNAPPY],
    [Method.BeaconBlocksByRoot, Version.V2, Encoding.SSZ_SNAPPY],
]];
exports.ProtocolsSupported = ProtocolsSupported;