import { drizzleReactHooks } from "@drizzle/react-plugin";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import EthCrypto from "eth-crypto";
import Eth from "ethjs";
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
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EncryptedContentDialog(props) {
  const { content, open, onClose } = props;
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Encrypted Content</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{ overflowWrap: "break-word" }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EncryptedContentDialog.propTypes = {
  content: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

function EncryptedIPFSTimestampControls(props) {
  const { file } = props;
  const classes = useStyles();
  const { currentAccount, ipfsClient } = React.useContext(AppContext);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const [fileContentBuffer, setFileContentBuffer] = React.useState(undefined);
  const [encryptedContent, setEncryptedContent] = React.useState(undefined);
  const [ipfsIdentifier, setIPFSIdentifier] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [extra, setExtra] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showContentDialog, setShowContentDialog] = React.useState(false);

  React.useEffect(() => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      setFileContentBuffer(buffer);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const onEncryptDocument = React.useCallback(async () => {
    // see https://github.com/pubkey/eth-crypto#encryptwithpublickey
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
    const encryptedContentObject = await EthCrypto.encryptWithPublicKey(
      publicKey,
      fileContentBuffer.toString()
    );
    const encryptedContentString = EthCrypto.cipher.stringify(
      encryptedContentObject
    );
    setEncryptedContent(encryptedContentString);
  }, [fileContentBuffer, privateKey]);

  const onUploadToIPFS = React.useCallback(async () => {
    if (encryptedContent) {
      const f = async () => {
        for await (const result of ipfsClient.add(encryptedContent)) {
          setIPFSIdentifier(result.path);
        }
      };
      setLoading(true);
      f()
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [encryptedContent, ipfsClient]);

  const onSignDocument = React.useCallback(() => {
    const eth = new Eth(web3.givenProvider);

    eth.personal_sign(encryptedContent, currentAccount).then(setSignature);
  }, [currentAccount, encryptedContent, web3.givenProvider]);

  const onCreateTimestamp = React.useCallback(() => {
    const stackID = drizzle.contracts.TimestampFactory.methods.createTimestamp.cacheSend(
      signature,
      ipfsIdentifier,
      extra,
      { gas: 500000 }
    );
    console.log(stackID);
  }, [
    drizzle.contracts.TimestampFactory.methods,
    extra,
    ipfsIdentifier,
    signature,
  ]);

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <EncryptedContentDialog
        open={showContentDialog}
        content={encryptedContent}
        onClose={() => setShowContentDialog(false)}
      />
      <Grid display="flex" container spacing={3}>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            label="Your private key"
            value={privateKey}
            placeholder="E123..."
            onChange={(event) => setPrivateKey(event.target.value)}
          />
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={onEncryptDocument}
          >
            Encrypt document with this key
          </Button>
          {encryptedContent ? (
            <Button
              className={classes.button}
              color="secondary"
              variant="outlined"
              onClick={() => setShowContentDialog(true)}
            >
              View
            </Button>
          ) : undefined}
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="IPFS Identifier (CID)"
            value={ipfsIdentifier}
          />

          <div className={classes.wrapper}>
            <Button
              className={classes.button}
              variant="outlined"
              color="secondary"
              disabled={loading || !Boolean(encryptedContent)}
              onClick={onUploadToIPFS}
            >
              Upload to IPFS
            </Button>
            {loading && encryptedContent && !ipfsIdentifier && (
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
              className={classes.button}
              variant="outlined"
              color="secondary"
              disabled={loading || !Boolean(ipfsIdentifier)}
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
            placeholder={`Additional info (e.g. '${file.name}')`}
            onChange={(event) => setExtra(event.target.value)}
            value={extra}
          />
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <Button
            color="secondary"
            disabled={
              !Boolean(signature) ||
              !Boolean(encryptedContent) ||
              !Boolean(ipfsIdentifier)
            }
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

EncryptedIPFSTimestampControls.propTypes = {
  file: PropTypes.any.isRequired,
};

export default EncryptedIPFSTimestampControls;
