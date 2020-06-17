import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { AppContext } from "../../contexts/app";

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

  const { accounts, currentAccount } = React.useContext(AppContext);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const MetamaskInfo = React.useMemo(() => {
    return typeof window.ethereum === "undefined" ? (
      <Typography variant="body1">
        No Metamask plugin detected. Consider adding the Metamask extension to
        your browser.
      </Typography>
    ) : undefined;
  }, []);

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
      {AccountInfo}
    </Box>
  );
}

export default AccountControls;
