import React from "react";
import ipfsClient from "ipfs-http-client";

const AppContext = React.createContext({
  accounts: [],
  currentAccount: undefined,
  ipfsClient: undefined,
});

function AppProvider(props) {
  const [accounts, setAccounts] = React.useState([]);
  const [currentAccount, setCurrentAccount] = React.useState(undefined);
  const [ipfs, setIpfs] = React.useState(undefined);

  React.useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.enable().then((accounts) => {
        setAccounts(accounts);
        setCurrentAccount(accounts[0]);
      });

      window.ethereum.on("accountsChanged", function (accounts) {
        setAccounts(accounts);
        setCurrentAccount(accounts[0]);
      });
    }

    const ipfs = ipfsClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    setIpfs(ipfs);
  }, []);

  const contextValue = {
    accounts,
    currentAccount,
    ipfsClient: ipfs,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
