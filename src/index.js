const { createNodeJsLibp2p } = require("./networking/lip2p/initialize");
const { args } = require("./args");
const { Network } = require("./networking/network");

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    let network = new Network(libp2p);
    await network.start();
    print(network.libp2p.connections, network);
}

async function print(libp2p, network){
    var items = [];   
    var remotePeers = []
    for(const connections of libp2p){
        items.push(connections[1][0].id);
        remotePeers.push(connections[1][0].remotePeer);
    }
    console.log(items.join(", "));
    
    if(items.length > 2){
        for(let i = 0; i < remotePeers.length; i++){
            const response = await network.reqResp.metaData(remotePeers[i]);
            console.log(response);
        }
        
    }
    setTimeout(print, 3000, libp2p, network);
}

launch();