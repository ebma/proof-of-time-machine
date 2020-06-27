import { Box, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CopyIcon from "@material-ui/icons/FileCopy";
import React from "react";
import { AppContext } from "../../contexts/app";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: theme.spacing(2),
  },
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

function ShareArea({ timestamp }) {
  const classes = useStyles();

  const [success, setSuccess] = React.useState(undefined);
  const { currentAccount } = React.useContext(AppContext);

  const copyToClipboard = React.useCallback(() => {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        const url =
          window.location.origin +
          `?id=${timestamp.id}&address=${currentAccount}`;

        window.navigator.clipboard.writeText(url).then(
          function () {
            setSuccess(true);
          },
          function () {
            setSuccess(false);
          }
        );
      }
    });
  }, [currentAccount, timestamp]);

  return (
    <Box className={classes.root}>
      <Typography variant="body1">
        You can create a shareable link which will contain the ID of this
        timestamp and your account address.
      </Typography>
      <Typography variant="body1">
        This will make it easy for other people to verify that this timestamp
        belongs to you.
      </Typography>
      <div className={classes.buttonContainer}>
        <Button
          color="secondary"
          variant="outlined"
          endIcon={<CopyIcon />}
          onClick={copyToClipboard}
        >
          Copy link to clipboard
        </Button>
        {success !== undefined ? (
          success === true ? (
            <Typography variant="body1">
              Successfully copied to clipboard!
            </Typography>
          ) : (
            <Typography variant="body1">Something went wrong...</Typography>
          )
        ) : undefined}
      </div>
    </Box>
  );
}

export default ShareArea;
