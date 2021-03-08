# TODOs

- [ ] Look at making Hydra2 a singleton - there probably shouldn't be more than one instance running due to how Redis keys are used and the fact that there are timers involved.
- [ ] Before a release uncomment `noUnusedLocals` in tsconfig.json and rebuild to check for unused local vars.