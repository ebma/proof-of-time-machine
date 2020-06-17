import { Box, Typography } from "@material-ui/core";
import React from "react";
import { AppContext } from "../../contexts/app";

function AccountControls() {
  const { currentAccount } = React.useContext(AppContext);

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
