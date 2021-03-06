var config = require('./config.json');
import Hydra2 from './hydra2/hydra2';

function main() {
  return new Promise((resolve, reject) => {
    const hydra = new Hydra2;
    hydra.init(config);
  });  
}

(async () => {
  try {
    await main();
  } catch (e) {
  }
})();