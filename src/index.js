const { createNodeJsLibp2p } = require("./networking/lip2p/initialize");
const { args } = require("./args");
const { Network } = require("./networking/network");

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    let network = new Network(libp2p);
    await network.start();
    print(network.libp2p.connections)
}

async function print(libp2p){
    var items = [];   
    for(const connections of libp2p){
        items.push(connections[1][0].stat.status);
    }
    console.log("Connected to " + items.length + " peers.");
    setTimeout(print, 1000, libp2p);
}

launch();