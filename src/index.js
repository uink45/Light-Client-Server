const { createNodeJsLibp2p } = require("./networking/lip2p/initialize");
const Gossipsub = require("libp2p-gossipsub");
const { gossipsubParams } = require("./networking/gossipsub/gossipsub");
const { args } = require("./args");

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    let gossipsub = new Gossipsub(libp2p, gossipsubParams);
    await libp2p.start();
    await gossipsub.start();
    libp2p.connectionManager._latencyMonitor.stop();
    print(libp2p.connectionManager.connections);
    for(const peer of libp2p.connectionManager.connections){
        console.log("Local peer" + peer[1][0].localPeer);
    }
    /*
    
    */
}

async function print(libp2p){
    var items = [];
    
    for(const peer of libp2p){
        items.push(peer[1][0].remoteAddr);
        console.log(peer[1][0].remotePeer);
    }
    /*
    //console.log();
    //console.log("Local addresses: " + items.join(', '));
    */
    
    for(const connections of libp2p){
        items.push(connections[1][0].stat.status);
    }
    console.log("Connected to " + items.length + " peers.");
    
    setTimeout(print, 1000, libp2p);
}

launch();