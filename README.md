# openST Platform Restful APIs

This project show the sample restful api implementation of openST Platform.

## Prerequisite installations 

* Install node version >= 7
* Install geth version >= 1.7.2

## Setup Chains and deploy required contracts

####Terminal 1

* Install node modules
```bash
  > npm install
```

* Start the openST Platform setup
```bash
  > node node_modules/@openstfoundation/openst-platform/tools/setup/index.js development
```

* Load platform environment variables  
```bash
  > source openst-setup/openst_env_vars.sh
```

* Start all platform services in background (i.e. geth nodes and intercoms)  
```bash
  > node services.js
```

####Terminal 2

* Load platform environment variables  
```bash
  > source openst-setup/openst_env_vars.sh
```

* Start the Branded Token registration
```bash
  > node register_bt.js
```