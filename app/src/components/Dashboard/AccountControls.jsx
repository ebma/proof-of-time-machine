import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },
}));

function AccountControls() {
  const classes = useStyles();
  const [metamaskAvailable, setMetamaskAvailable] = React.useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = React.useState(false);
  const [currentAccount, setCurrentAccount] = React.useState("None");

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  React.useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskAvailable(true);
    } else {
      setMetamaskAvailable(false);
    }
  }, []);

  const onEnable = React.useCallback(() => {
    window.ethereum.enable().then((accounts) => {
      setMetamaskEnabled(true);
      web3.eth.defaultAccount = accounts[0];
      setCurrentAccount(accounts[0]);
    });

    window.ethereum.on("accountsChanged", function (accounts) {
      web3.eth.defaultAccount = accounts[0];
      setCurrentAccount(accounts[0]);
    });
  }, [web3.eth.defaultAccount]);

  const MetamaskInfo = React.useMemo(() => {
    return !metamaskAvailable ? (
      <Typography variant="body1">
        No Metamask plugin detected. Consider adding the Metamask extension to
        your browser.
      </Typography>
    ) : undefined;
  }, [metamaskAvailable]);

  const AccountInfo = React.useMemo(
    () => (
      <Typography variant="body1">
        Your current account is: {currentAccount}
      </Typography>
    ),
    [currentAccount]
  );

  return (
    <Box align="center">
      {MetamaskInfo}
      <Box className={classes.box}>
        <Typography>
          In order to use your locally stored accounts please enable the
          Metamask plugin.
        </Typography>
        <Button
          className={classes.button}
          disabled={!metamaskAvailable || metamaskEnabled}
          onClick={onEnable}
          variant="contained"
          color="secondary"
        >
          Enable Ethereum/Metamask
        </Button>
      </Box>
      {AccountInfo}
    </Box>
  );
}

export default AccountControls;
