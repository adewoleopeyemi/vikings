const kingslumToken = artifacts.require("kingslumToken");

module.exports = function (deployer) {
  deployer.deploy(kingslumToken, 1000000);
};
 