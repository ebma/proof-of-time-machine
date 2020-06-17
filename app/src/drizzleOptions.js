import IdentityService from "./contracts/IdentityService.json";
import TimestampFactory from "./contracts/TimestampFactory.json";

const options = {
  web3: {
    fallback: {
      type: "ws",
      url: "ws://localhost:7545",
    },
  },
  contracts: [IdentityService, TimestampFactory],
  events: {
    TimestampFactory: ["NewTimestamp"],
  },
};

export default options;
