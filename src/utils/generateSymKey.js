const forge = require('node-forge');

const generateSymKey = () => {
  const symKey = forge.random.getBytesSync(32);
  return symKey;
};

module.exports = generateSymKey;
