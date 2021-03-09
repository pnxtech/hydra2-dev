REDIS_ID=$(docker ps -qf "name=redis")
docker exec -it ${REDIS_ID} /usr/local/bin/redis-cli -c -p 7000
