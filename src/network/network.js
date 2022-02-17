const { createNodeJsLibp2p } = require("./lip2p/initialize");

class Network{
    constructor(args){
        this.libp2p = await createNodeJsLibp2p(args);
    }
    async start(){

    }
}