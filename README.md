# hydra2-dev
Hydra2 development environment

![](hydra2.png)


## Monitoring Redis
I tried using Redis Insight - running both in the cluster and outside of it and was unable get it to work with `grokzen/redis-cluster:6.0.9` image.  However [Medis](https://github.com/luin/medis) worked just fine - albiat without the monitoring present in the Redis Insight tool.  I'd love to get this working in the future. - cjus

