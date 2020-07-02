import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Box, Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Base64 } from "js-base64";
import { PropTypes } from "prop-types";
import React from "react";
import { AppContext } from "../../contexts/app";

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
  const classes = useStyles();
  const { currentAccount } = React.useContext(AppContext);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const [signature, setSignature] = React.useState("");
  const [extra, setExtra] = React.useState("");

  const onSignDocument = React.useCallback(async () => {
    const contentString = Base64.fromUint8Array(
      new Uint8Array(props.fileContent)
    );

    web3.eth.personal.sign(contentString, currentAccount).then(setSignature);
  }, [props.fileContent, currentAccount, web3.eth.personal]);

  const onCreateTimestamp = React.useCallback(() => {
    const stackId = drizzle.contracts.TimestampFactory.methods.createTimestamp.cacheSend(
      signature,
      "",
      extra,
      { gas: 500000 }
    );

    console.log("stackID", stackId);
  }, [drizzle.contracts.TimestampFactory.methods, extra, signature]);

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <Grid display="flex" container spacing={3}>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="Your Signature"
            value={signature}
          />
          <Button
            className={classes.button}
            onClick={onSignDocument}
            color="secondary"
          >
            Sign Document
          </Button>
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            label="(Optional) Extra"
            placeholder={`Additional info (e.g. '${props.file.name}')`}
            onChange={(event) => setExtra(event.target.value)}
            value={extra}
          />
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
  fileContent: PropTypes.any,
};

export default SimpleTimestampControls;
