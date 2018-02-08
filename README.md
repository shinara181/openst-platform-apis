# openST Platform Restful APIs Setup

This project show the sample restful api implementation of openST Platform.

* Install node modules required restful APIs implementation

```bash
  > npm install
```
  
* Setup openST Platform by referring the CONFIGURE.md in openst-platform repository
  - NOTE: Use "node_modules/@openstfoundation/openst-platform/" before any node script
  - Example: 
```bash
  > node node_modules/@openstfoundation/openst-platform/tools/setup/start_services.js
```

* Load platform environment variables  

```bash
  > source $HOME/openst-setup/openst_env_vars.sh
```

* Start Utility and Value Chain geth nodes   
```bash
  > sh $HOME/openst-setup/bin/run-utility.sh
  > sh $HOME/openst-setup/bin/run-value.sh
```

* Start application server   
```bash
  > node app.js
```
