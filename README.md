# Light Client Server 

This is a [Lodestar Beacon Chain Client](https://github.com/ChainSafe/lodestar) that has been modified to serve REST-API requests from a light client.

### Requirements
- Node.js - [Downloaded here](https://nodejs.org/en/)
- Yarn - Installed via the command `npm install --global yarn`

### Instructions
Open the command prompt and run the following commands:
```
git clone https://github.com/uink45/Light-Client-Server.git
cd "./Light-Client-Server"
yarn install
```

### Running Server
Type the following in the command prompt to initialize the server:
```
node --trace-deprecation --max-old-space-size=6144 packages/cli/bin/lodestar beacon --eth1.enabled false --network mainnet --weakSubjectivityServerUrl https://21qajKWbOdMuXWCCPEbxW1bVPrp:5e43bc9d09711d4f34b55077cdb3380a@eth2-beacon-mainnet.infura.io --weakSubjectivitySyncLatest true
```

