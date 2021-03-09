source stack_name.sh
#export REDIS_CLUSTER_IP=0.0.0.0
mkdir -p logs ~/data/${STACK_NAME} ~/data/${STACK_NAME}/redis ~/data/${STACK_NAME}/redis-cluster ~/data/${STACK_NAME}/redis-insight
docker stack deploy --compose-file base-cluster-compose.yml ${STACK_NAME}
