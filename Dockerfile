FROM ubuntu
RUN apt-get update && apt-get install -y g++ vim zip make 
WORKDIR /home/hydra2
