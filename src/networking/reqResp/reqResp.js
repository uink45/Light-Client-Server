// Use remote peer for the peer-id.
const { ProtocolsSupported, ProtocolPrefix, Method, Version, Encoding } = require("./types");
const { submitRequest } = require("./request");


class ReqResp{
    constructor(libp2p, config){
        this.libp2p = libp2p;
        this.config = config; 
    }

    async status(peerId, request){

    }

    async sendRequest(peerId, method, versions, body, maxResponses = 1){
        const encoding = Encoding.SSZ_SNAPPY;
        
        const result = await submitRequest();
    }
}


exports.ReqResp = ReqResp;