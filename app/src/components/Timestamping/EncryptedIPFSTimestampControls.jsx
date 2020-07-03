import { drizzleReactHooks } from "@drizzle/react-plugin";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import EthCrypto from "eth-crypto";
import { PropTypes } from "prop-types";
import React from "react";
import { Base64 } from "js-base64";
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

function EncryptedIPFSTimestampControls(props) {
  const classes = useStyles();
  const { currentAccount, ipfsClient } = React.useContext(AppContext);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;

  const [ipfsIdentifier, setIPFSIdentifier] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [extra, setExtra] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const getEncryptedContent = React.useCallback(async () => {
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);

    const content = Base64.btoa(new Uint8Array(props.fileContent));
    console.log("content", content);

    const encryptedContentObject = await EthCrypto.encryptWithPublicKey(
      publicKey,
      content
    );

    const encryptedContentString = EthCrypto.cipher.stringify(
      encryptedContentObject
    );

    return encryptedContentString;
  }, [privateKey, props.fileContent]);

  const onUploadToIPFS = React.useCallback(async () => {
    // see https://github.com/pubkey/eth-crypto#encryptwithpublickey
    const encryptedContent = await getEncryptedContent();

    if (encryptedContent) {
      console.log("encryptedContent", encryptedContent);
      const f = async () => {
        for await (const result of ipfsClient.add(encryptedContent)) {
          console.log("got result", result);
          setIPFSIdentifier(result.path);
        }
      };
      setLoading(true);
      f()
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [getEncryptedContent, ipfsClient]);

  const onSignDocument = React.useCallback(async () => {
    if (ipfsIdentifier) {
      web3.eth.personal.sign(ipfsIdentifier, currentAccount).then(setSignature);
    }
  }, [currentAccount, ipfsIdentifier, web3.eth]);

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
            label="Your private key"
            value={privateKey}
            placeholder="E123..."
            onChange={(event) => setPrivateKey(event.target.value)}
          />
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
              disabled={loading || !Boolean(privateKey)}
              onClick={onUploadToIPFS}
            >
              Upload to IPFS
            </Button>
            {loading && !ipfsIdentifier && (
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
            placeholder={`Additional info (e.g. '${props.file.name}')`}
            onChange={(event) => setExtra(event.target.value)}
            value={extra}
          />
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <Button
            color="secondary"
            disabled={!Boolean(signature) || !Boolean(ipfsIdentifier)}
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
  fileContent: PropTypes.any,
};

export default EncryptedIPFSTimestampControls;
