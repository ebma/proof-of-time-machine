import Web3 from "web3";
import IdentityService from "./contracts/IdentityService.json";
import TimestampFactory from "./contracts/TimestampFactory.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [IdentityService, TimestampFactory],
  events: {
    TimestampFactory: ["NewTimestamp"],
  },
};

export default options;
