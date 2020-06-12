const TimestampFactory = artifacts.require("TimestampFactory");
const IdentityService = artifacts.require("IdentityService");

module.exports = function (deployer) {
  deployer.deploy(TimestampFactory);
  deployer.deploy(IdentityService);
};
