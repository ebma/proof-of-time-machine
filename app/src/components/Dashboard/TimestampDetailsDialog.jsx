import { Divider, Grid, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import EthCrypto from "eth-crypto";
import mime from "mime-types";
import { PropTypes } from "prop-types";
import React from "react";
import { AppContext } from "../../contexts/app";
import TimestampDetails from "../Timestamping/TimestampDetails";

const fileRetrievalStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
  },

  buttonProgress: {
    color: red[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  textField: {
    minWidth: 300,
  },
}));

function FileRetrievalArea({ cid }) {
  const classes = fileRetrievalStyles();

  const [downloadedData, setDownloadedData] = React.useState(undefined);
  const [decryptedContent, setDecryptedContent] = React.useState(undefined);
  const [mimeTypeInput, setMimeTypeInput] = React.useState("");
  const [mimeType, setMimeType] = React.useState(undefined);
  const [privateKey, setPrivateKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { ipfsClient } = React.useContext(AppContext);

  const downloadContent = React.useCallback(async () => {
    setLoading(true);
    const chunks = [];
    for await (const chunk of ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }

    setLoading(false);
    setDownloadedData(chunks);
  }, [cid, ipfsClient]);

  const decryptContent = React.useCallback(async () => {
    try {
      setLoading(true);
      // use blob as workaround for parsing the downloaded data chunks
      const blob = new Blob(downloadedData, { type: "" });
      const cipherString = await blob.text();
      const cipherObject = EthCrypto.cipher.parse(cipherString);

      const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        cipherObject
      );

      console.log("decrypted", decrypted);

      setDecryptedContent(decrypted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [downloadedData, privateKey]);

  const openFile = React.useCallback(() => {
    // data has to be of type array
    const data = decryptedContent ? [decryptedContent] : downloadedData;
    const blob = new Blob(data, { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }, [decryptedContent, downloadedData, mimeType]);

  const handleMimeTypeChange = React.useCallback((event) => {
    const input = event.target.value;
    setMimeTypeInput(input);

    const foundMimeType = mime.lookup(input);
    setMimeType(foundMimeType);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid className={classes.gridItem} item xs={12}>
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            disabled={loading || Boolean(downloadedData)}
            onClick={downloadContent}
            endIcon={downloadedData ? <CheckIcon /> : undefined}
          >
            Download
          </Button>
          {loading && !downloadedData && (
            <CircularProgress size={36} className={classes.buttonProgress} />
          )}
        </div>
      </Grid>
      <Grid className={classes.gridItem} item xs={12}>
        <TextField
          className={classes.textField}
          disabled={!downloadedData}
          label="Decryption key"
          placeholder="E..."
          onChange={(event) => setPrivateKey(event.target.value)}
          value={privateKey}
        />

        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            disabled={loading || !downloadedData || !privateKey}
            onClick={decryptContent}
            endIcon={decryptedContent ? <CheckIcon /> : undefined}
          >
            Decrypt
          </Button>
          {loading && downloadedData && (
            <CircularProgress size={36} className={classes.buttonProgress} />
          )}
        </div>
      </Grid>
      <Grid className={classes.gridItem} item xs={12}>
        <TextField
          className={classes.textField}
          disabled={!downloadedData}
          error={mimeType === false}
          label={`MIME Type (${mimeType ? mimeType : "Not found"})`}
          onChange={handleMimeTypeChange}
          placeholder="e.g. 'application/pdf'"
          value={mimeTypeInput}
        />
        <Button
          className={classes.button}
          color="secondary"
          disabled={!downloadedData || !mimeType}
          onClick={openFile}
          variant="outlined"
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

const dialogStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.grey[500],
  },
  typographyItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  },
}));

function TimestampDetailsDialog(props) {
  const { open, timestamp, onClose } = props;

  const classes = dialogStyles();

  console.log("timestamp", timestamp);

  return (
    <div>
      {timestamp ? (
        <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
          <DialogTitle id="alert-dialog-slide-title">
            Timestamp Details
          </DialogTitle>
          <DialogContent className={classes.root}>
            <TimestampDetails timestamp={timestamp} />
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            {timestamp.cid ? (
              <FileRetrievalArea cid={timestamp.cid} />
            ) : undefined}
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.closeButton}
              onClick={onClose}
              color="primary"
              endIcon={<CloseIcon />}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : undefined}
    </div>
  );
}

TimestampDetailsDialog.propTypes = {
  timestamp: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default TimestampDetailsDialog;
