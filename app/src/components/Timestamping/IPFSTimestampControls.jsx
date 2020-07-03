import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Box, Button, Grid, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
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
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: red[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function IPFSTimestampControls(props) {
  const classes = useStyles();
  const { currentAccount, ipfsClient } = React.useContext(AppContext);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const [ipfsIdentifier, setIPFSIdentifier] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [extra, setExtra] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onUploadToIPFS = React.useCallback(() => {
    if (props.fileContent) {
      const f = async () => {
        for await (const result of ipfsClient.add(props.fileContent)) {
          console.log("result", result);
          setIPFSIdentifier(result.path);
        }
      };
      setLoading(true);
      f()
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [props.fileContent, ipfsClient]);

  const onSignDocument = React.useCallback(() => {
    if (ipfsIdentifier) {
      web3.eth.personal.sign(ipfsIdentifier, currentAccount).then(setSignature);
    }
  }, [currentAccount, ipfsIdentifier, web3.eth.personal]);

  const onCreateTimestamp = React.useCallback(() => {
    drizzle.contracts.TimestampFactory.methods.createTimestamp.cacheSend(
      signature,
      ipfsIdentifier,
      extra,
      { gas: 500000 }
    );
  }, [
    drizzle.contracts.TimestampFactory.methods,
    extra,
    ipfsIdentifier,
    signature,
  ]);

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <Grid display="flex" container spacing={3}>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="IPFS Identifier (CID)"
            value={ipfsIdentifier}
          />

          <div className={classes.wrapper}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.buttonClassname}
              disabled={loading}
              onClick={onUploadToIPFS}
            >
              Upload to IPFS
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="Your Signature"
            value={signature}
          />

          <div className={classes.wrapper}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.buttonClassname}
              disabled={loading || !ipfsIdentifier}
              onClick={onSignDocument}
            >
              Sign Document
            </Button>
            {loading && ipfsIdentifier && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
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
          <Button
            color="secondary"
            disabled={!signature || !ipfsIdentifier}
            fullWidth
            onClick={onCreateTimestamp}
          >
            Create timestamp
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

IPFSTimestampControls.propTypes = {
  file: PropTypes.any.isRequired,
  fileContent: PropTypes.any,
};

export default IPFSTimestampControls;
