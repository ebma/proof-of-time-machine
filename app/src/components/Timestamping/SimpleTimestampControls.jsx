import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Box, Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Eth from "ethjs";
import { PropTypes } from "prop-types";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  item: {
    display: "flex",
  },
  textField: {
    flexGrow: 1,
  },
  button: {
    height: "fit-content",
    margin: theme.spacing(1),
  },
}));

function SimpleTimestampControls(props) {
  const { file } = props;
  const classes = useStyles();

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const [fileContent, setFileContent] = React.useState("");
  const [signedHash, setSignedHash] = React.useState("");

  React.useEffect(() => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setFileContent(reader.result);
    };
    reader.readAsText(file);
  }, [file]);

  const onSignHash = React.useCallback(() => {
    const eth = new Eth(web3.givenProvider);

    eth.personal_sign(fileContent, web3.eth.defaultAccount).then(setSignedHash);
  }, [fileContent, web3.eth.defaultAccount, web3.givenProvider]);

  const onCreateTimestamp = React.useCallback(() => {
    const stackId = drizzle.contracts.TimestampFactory.methods.createTimestamp.cacheSend(
      signedHash,
      false,
      { gas: 1000000 }
    );

    console.log("stackID", stackId);
  }, [drizzle.contracts.TimestampFactory.methods, signedHash]);

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <Grid display="flex" container spacing={3}>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="Your Signature"
            value={signedHash}
          />
          <Button
            className={classes.button}
            onClick={onSignHash}
            color="secondary"
          >
            Sign Document
          </Button>
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <Button color="secondary" fullWidth onClick={onCreateTimestamp}>
            Create timestamp
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

SimpleTimestampControls.propTypes = {
  file: PropTypes.any.isRequired,
};

export default SimpleTimestampControls;
