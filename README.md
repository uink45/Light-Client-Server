# Light Client Server 

This is a Lodestar Beacon Chain Client that has been modified to serve REST-API requests from a light client.

### Requirements
- Yarn - Installed via `npm install --global yarn`
- Git Bash - [Download from here](https://git-scm.com/download/win)

### Instructions
Open the Git Bash command shell and run the following commands:
```
git clone https://github.com/chainsafe/lodestar.git
cd "./lodestar"
yarn install
yarn run build
```

### Running Server
Type the following command in the Git Bash command shell to initialize the server:
```
./lodestar beacon --eth1.enabled false --network mainnet --weakSubjectivityServerUrl https://21qajKWbOdMuXWCCPEbxW1bVPrp:5e43bc9d09711d4f34b55077cdb3380a@eth2-beacon-mainnet.infura.io --weakSubjectivitySyncLatest true
```

