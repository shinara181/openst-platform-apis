# openST Platform Restful APIs

This project show the sample restful api implementation of openST Platform.

## Prerequisite installations 

* Install node version >= 7
* Install geth version >= 1.7.2

## Setup Chains and deploy required contracts

####Terminal 1

* Install node modules required for openST platform and it's sample restful API implementation
```bash
  > npm install
```

* Start the openST platform setup. Setup script will create "openst-setup" folder in your $HOME folder. Setup folder contains:
1. openst-geth-value - Acts as ethereum MainNet for development environment. Chain runs on POW consensus algorithm.
2. openst-geth-utility - Acts as openST side chain network for development environment. Chain runs on POA consensus algorithm.  
3. openst_env_vars.sh - Environment variables required for platform
4. run.sh - Both folders configured for value and utility chains contain their respective run.sh file to start the chains. 
```bash
  > node node_modules/@openstfoundation/openst-platform/tools/setup/index.js development
```

* Load platform environment variables  
```bash
  > source $HOME/openst-setup/openst_env_vars.sh
```

* Start all platform services in background (i.e. geth nodes and intercoms). We keep checking if all required services are up and running and publish alert messages if any service goes down. You can also run these services individually as well.   
```bash
  > node services.js
```

####Terminal 2

* Load platform environment variables  
```bash
  > source $HOME/openst-setup/openst_env_vars.sh
```

* Start the Branded Token registration and write the registration details in config file for later use. For each new branded token please modify the following details in script:
1. oThis.btName - branded token name
2. oThis.btSymbol - branded token symbol
3. oThis.btConversionRate - branded token to OST conversion rate, 1 OST = x branded tokens
```bash
  > node register_bt.js
```