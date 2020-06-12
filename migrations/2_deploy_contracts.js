const Timestamp = artifacts.require("Timestamp");
const IdentityService = artifacts.require("IdentityService");

module.exports = function (deployer) {
  deployer.deploy(Timestamp);
  deployer.deploy(IdentityService);
};
