const kingslimToken = artifacts.require("kingslimToken");

module.exports = function (deployer) {
  deployer.deploy(kingslimToken, 1000000);
};
 