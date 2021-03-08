var config = require('./config.json');
import Hydra2 from './hydra2/hydra2';

async function main() {
  const hydra = Hydra2.getInstance();
  await hydra.init(config);
}

(async () => {
  try {
    await main();
  } catch (e) {
  }
})();
