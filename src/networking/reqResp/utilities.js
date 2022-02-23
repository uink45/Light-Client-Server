function prettyPrintPeerId(peerId) {
    const id = peerId.toB58String();
    return `${id.substr(0, 2)}...${id.substr(id.length - 6, id.length)}`;
}
exports.prettyPrintPeerId = prettyPrintPeerId;


function formatProtocolId(method, version, encoding){
    return `${ProtocolPrefix}/${method}/${version}/${encoding}`;
}
exports.formatProtocolId = formatProtocolId;


