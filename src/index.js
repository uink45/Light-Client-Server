const { createNodeJsLibp2p } = require("./networking/lip2p/initialize");
const { args } = require("./args");
const { Network } = require("./networking/network");

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    let network = new Network(libp2p);
    await network.start();
    try{
        connect(network.libp2p.connections, network);
    }
    catch(e){
        console.log("Stream reset error. Creating new stream...")
        connect(network.libp2p.connections,network);
    }
    
}

async function connect(libp2p, network){
    console.clear();
    var items = 0;
    for(const connections of libp2p){
        if(connections[1][0].stat.status == "open"){
            const response = await network.reqResp.metaData(connections[1][0].remotePeer);
            items++;
            if(response != null || response != undefined){
                console.log();
                console.log("Peer " + connections[1][0].id + " returned: ");
                console.log(response);
            }
            
        }
    }
    console.log("Connected to " + items + " peers.");
    setTimeout(connect, 4000, libp2p, network);
}

launch();