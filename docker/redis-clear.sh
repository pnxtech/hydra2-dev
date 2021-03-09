REDIS_ID=$(docker ps -aqf "name=redis")
docker exec -it ${REDIS_ID} /usr/local/bin/redis-cli -n 0 flushdb
