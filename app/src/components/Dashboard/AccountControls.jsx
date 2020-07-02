import { Box, Typography } from "@material-ui/core";
import React from "react";
import { AppContext } from "../../contexts/app";

function AccountControls() {
  const { currentAccount } = React.useContext(AppContext);

  const MetamaskInfo = React.useMemo(() => {
    return typeof window.ethereum === "undefined" ? (
      <Typography variant="h6" style={{ color: "red" }}>
        No Metamask plugin detected. You must install the Metamask extension or
        use the Brave Browser to use this application.
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
