# Light Client Server 

This is a [Lodestar Beacon Chain Client](https://github.com/ChainSafe/lodestar) that has been modified to serve REST-API requests from a light client.

### Requirements
- Yarn - Installed via the command `npm install --global yarn`
- Git Bash - [Download](https://git-scm.com/download/win)

### Instructions
Open the Git Bash command shell and run the following commands:
```
git clone https://github.com/uink45/Light-Client-Server.git
cd "./Light-Client-Server"
yarn install
```

### Running Server
Type the following command in the Git Bash command shell to initialize the server:
```
./lodestar beacon --eth1.enabled false --network mainnet --weakSubjectivityServerUrl https://21qajKWbOdMuXWCCPEbxW1bVPrp:5e43bc9d09711d4f34b55077cdb3380a@eth2-beacon-mainnet.infura.io --weakSubjectivitySyncLatest true
```

