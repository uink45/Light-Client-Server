const { createNodeJsLibp2p } = require("./lip2p/initialize");

const args = {
    _: [ 'beacon' ],
   'eth1.enabled': false,
   network: 'mainnet',
   'api.rest.api': [ 'lightclient', 'beacon' ],
   '$0': ''
}

async function launch(){
    let libp2p = await createNodeJsLibp2p(args);
    
    await libp2p.start();
    libp2p.connectionManager._latencyMonitor.stop();
    print(libp2p);
}

async function print(libp2p){
    console.log("Connected to " + libp2p.connectionManager.size + " peers.");
    setTimeout(print, 3000, libp2p);
}

launch();