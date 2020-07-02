import { Grid, TextField, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import EthCrypto from "eth-crypto";
import mime from "mime-types";
import React from "react";
import { AppContext } from "../../contexts/app";

const useStyles = makeStyles((theme) => ({
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
    alignSelf: "center",
    minWidth: 300,
    maxWidth: 800,
  },
}));

function FileRetrievalArea({ cid }) {
  const classes = useStyles();

  const [mimeTypeInput, setMimeTypeInput] = React.useState("");
  const [mimeType, setMimeType] = React.useState(undefined);
  const [privateKey, setPrivateKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { ipfsClient } = React.useContext(AppContext);

  const openFile = React.useCallback(
    (data) => {
      // data has to be of type array
      const blob = new Blob(data, { type: mimeType });
      const url = URL.createObjectURL(blob);
      window.open(url);
    },
    [mimeType]
  );

  const downloadContent = React.useCallback(async () => {
    setLoading(true);
    const chunks = [];
    for await (const chunk of ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }

    setLoading(false);
    openFile(chunks);
  }, [cid, ipfsClient, openFile]);

  const downloadAndDecryptContent = React.useCallback(async () => {
    try {
      setLoading(true);

      const chunks = [];
      for await (const chunk of ipfsClient.cat(cid)) {
        chunks.push(chunk);
      }
      // use blob as workaround for parsing the downloaded data chunks
      const blob = new Blob(chunks, { type: "" });
      const cipherString = await blob.text();
      const cipherObject = EthCrypto.cipher.parse(cipherString);

      const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        cipherObject
      );

      console.log("decrypted", decrypted);

      openFile([decrypted]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [cid, ipfsClient, openFile, privateKey]);

  const handleMimeTypeChange = React.useCallback((event) => {
    const input = event.target.value;
    setMimeTypeInput(input);

    const foundMimeType = mime.lookup(input);
    setMimeType(foundMimeType);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid
        className={classes.gridItem}
        item
        xs={12}
        style={{ flexDirection: "column" }}
      >
        <Typography align="center" variant="body1">
          Please enter the file extension of the file that you want to recover
          below.
        </Typography>
        <TextField
          className={classes.textField}
          error={mimeType === false}
          label={`File Extension (${mimeType ? mimeType : "Not found"})`}
          onChange={handleMimeTypeChange}
          placeholder="e.g. '.jpg'"
          value={mimeTypeInput}
        />
      </Grid>
      <Grid className={classes.gridItem} item xs={5}>
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            disabled={loading || !Boolean(mimeType)}
            onClick={downloadContent}
          >
            Download
          </Button>
          {loading && (
            <CircularProgress size={36} className={classes.buttonProgress} />
          )}
        </div>
      </Grid>
      <Grid className={classes.gridItem} item xs={1}>
        <Divider orientation="vertical" flexItem />
      </Grid>
      <Grid
        className={classes.gridItem}
        item
        xs={6}
        style={{ flexDirection: "column" }}
      >
        <Typography variant="body1">
          In case you encrypted this file before uploading you can decrypt it
          with the private key of the account that was used for encryption.
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            className={classes.textField}
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
              disabled={loading || !Boolean(mimeType) || !privateKey}
              onClick={downloadAndDecryptContent}
            >
              Download and Decrypt
            </Button>
            {loading && (
              <CircularProgress size={36} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default FileRetrievalArea;
