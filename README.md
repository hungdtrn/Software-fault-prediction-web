
  

# Software fault prediction web 

  

This project is for building a website that support storing program files, extracting software metrics and prediction software error.

  
## Project Structure

    ├── app                <- Contain sever and client files for running docker
    │   ├── new_client     <- Fodler of the website
    │   │   ├── build      <- Contain files for deployment (results of npm run build)
    │   │   ├── public
    │   │   ├── src        <- Contain files for development
    │   │   │   ├── routes <- Contain mappings from views to controllers
    │   │   │   ├── state  <- Contain controllers. The structure of this folder is based on Redux Duck
    │   │   │   │   ├── duck     <- Contain controllers for each views
    │   │   │   │   ├── globals  <- Contain shared parameters between each controller
    │   │   │   │   ├── utils    <- Contain codes for interacting with the server
    │   │   │   │   ├── saga.js   
    │   │   │   │   ├── store.js
    │   │   │   ├── views  <- Contain views for the web
    │   ├── server         <- Contain files for the server. Writen in Python. Using Flask.
    │   │   ├── app        <- Contain all files for developing the server
    │   │   │   ├── controllers  <- Handle the apis
    │   │   │   │   ├── api
    │   │   │   │   ├── decorators,py  <- Handle authentications
    │   │   │   ├── models  <- Interfaces to interact with MongoDB
    │   │   │   ├── config.py    <- configs for the server
    │   │   │   ├── ml.py   <- #IMPORTANT: Handle Machine Learning requests in the server. 
    │   │   ├── files       <- Where the files of the github page will be cloned  
    │   │   ├── tests       <- Unit tests for the server
    │   │   ├── .env
    │   │   ├── index.py    <- The running file of the server
    │   │   ├── requirements.txt <- Contain required packages for the server
    │   │   ├── utils.py
    ├── containers          <- Contain files to build custom docker containers
    ├── env_files           <- Contain environment files for docker
    ├── scripts             <- scripts to be used to run server in docker
    ├── volume              <- folders to be synced with docker containers
    ├── docker-compose.yml  <- run this file to start


## Prerequisite

Install docker. See [here](https://docs.docker.com/engine/install/ubuntu/)
Install docker-compose. See [here](https://docs.docker.com/compose/install/)
Install local-persist volume engine. See [here](https://github.com/MatchbookLab/local-persist)

## How to run
  
Clone the project

```
git clone https://github.com/hungdtrn/flask_mongo.git
cd flask_mongo
```

Run the docker compose

```
cd flask_mongo
docker-compose up -d
```

## For development

Any change in server code needs docker to reload to take effect. Hence, after changing server code, we need to stop docker and re-run it.

```
docker-compose stop
docker-compose up -d
```

Because we use React in client. We need to build the deployment files after changing the client codes. Then we need to reload the docker

```
# Build deployment files
cd app/new_client
npm run build

# Reload docker
cd ../../
docker-compose stop
docker-compose up -d
```
