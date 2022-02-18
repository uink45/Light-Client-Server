const { createNodeJsLibp2p } = require("./networking/lip2p/initialize");
const Gossipsub = require("libp2p-gossipsub");


const args = {
    _: [ 'beacon' ],
   'eth1.enabled': false,
   network: 'mainnet',
   'api.rest.api': [ 'lightclient', 'beacon' ],
   '$0': ''
}

const gossipsubParams = {
    D: 8,
    Dlo: 6,
    Dhi: 12,
    Dlazy: 6,
    heartbeatInterval: 700,
    fanoutTTL: 60000,
    mcacheLength: 6,
    mcacheGossip: 3,
    seenTTL: 550,
    scoreParams: {
        decayInterval: 12000,
        decayToZero: 0.01,
        retainScore: 38400000,
        appSpecificWeight: 1,
        IPColocationFactorThreshold: 3
    },
    scoreThresholds: {
        gossipThreshold: -4000,
        publishThreshold: -8000,
        graylistThreshold: -16000,
        acceptPXThreshold: 100,
        opportunisticGraftThreshold: 5,
    }
}

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    let gossipsub = new Gossipsub(libp2p, gossipsubParams);
    console.log(gossipsub._options);
    await libp2p.start();
    libp2p.connectionManager._latencyMonitor.stop();
    //print(libp2p.connections);

}

async function print(libp2p){
    /*
    var items = [];
    for(const peer of libp2p){
        items.push(peer[1][0].remoteAddr);
    }
    console.log();
    console.log("Local addresses: " + items.join(', '));
    */
    console.log("Connected to " + libp2p.size + " peers.");
    setTimeout(print, 3000, libp2p);
}

launch();