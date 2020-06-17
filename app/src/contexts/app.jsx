import React from "react";

const AppContext = React.createContext({
  accounts: [],
  currentAccount: undefined,
  currentBalance: undefined,
});

function AppProvider(props) {
  const [accounts, setAccounts] = React.useState([]);
  const [currentAccount, setCurrentAccount] = React.useState(undefined);

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
  }, []);

  const contextValue = {
    accounts,
    currentAccount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
