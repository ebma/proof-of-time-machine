import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BufferList from "bl/BufferList";
import Eth from "ethjs";
import React from "react";
import { AppContext } from "../../contexts/app";
import CustomDropzone from "../Timestamping/Dropzone";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flexGrow: 1,
  },
}));

function ValidatingArea() {
  const classes = useStyles();
  const { ipfsClient } = React.useContext(AppContext);
  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { web3 } = drizzle;
  const { TimestampFactory } = drizzle.contracts;

  const timestampStore = drizzleReactHooks.useDrizzleState((drizzleState) => ({
    ...drizzleState.contracts.TimestampFactory,
  }));

  const [timestampId, setTimestampId] = React.useState("");
  const [selectedTimestamp, setSelectedTimestamp] = React.useState(undefined);
  const [timestampCount, setTimestampCount] = React.useState(0);

  const [publicAddress, setPublicAddress] = React.useState("");
  const [file, setFile] = React.useState(undefined);
  const [fileContent, setFileContent] = React.useState(undefined);
  const [validationSuccess, setValidationSuccess] = React.useState(undefined);

  React.useEffect(() => {
    if (timestampId && timestampId < timestampCount) {
      TimestampFactory.methods
        .timestamps(timestampId)
        .call()
        .then(setSelectedTimestamp)
        .catch(console.error);
    } else {
      setSelectedTimestamp(undefined);
    }
  }, [timestampId, TimestampFactory.methods, timestampCount]);

  React.useEffect(() => {
    if ("0x0" in timestampStore.getTimestampCount) {
      setTimestampCount(
        parseInt(timestampStore.getTimestampCount["0x0"].value)
      );
    }
  }, [timestampStore.getTimestampCount]);

  React.useEffect(() => {
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      setFileContent(buffer.toString());
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  TimestampFactory.methods.getTimestampCount.cacheCall();

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
    }
  }, []);

  const downloadIPFSFile = React.useCallback(
    async (cid) => {
      let fileBuffer = new BufferList();
      for await (const result of ipfsClient.get(cid)) {
        for await (const chunk of result.content) {
          fileBuffer.append(chunk);
        }
        return fileBuffer.toString();
      }
    },
    [ipfsClient]
  );

  const validateTimestamp = React.useCallback(async () => {
    let originalFile = fileContent;
    if (selectedTimestamp.cid) {
      // file was uploaded to ipfs
      originalFile = await downloadIPFSFile(selectedTimestamp.cid);
    }

    const eth = new Eth(web3.givenProvider);
    const recoveredAddress = await eth.personal_ecRecover(
      originalFile,
      selectedTimestamp.signature
    );

    if (recoveredAddress === publicAddress) {
      setValidationSuccess(true);
    } else {
      setValidationSuccess(false);
    }
  }, [
    downloadIPFSFile,
    fileContent,
    selectedTimestamp,
    publicAddress,
    web3.givenProvider,
  ]);

  const onTimestampIdChange = (e) => {
    setTimestampId(e.target.value);
  };

  const onPublicAddressChange = (e) => {
    setPublicAddress(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField
            error={timestampId >= timestampCount}
            label={
              timestampId >= timestampCount
                ? "Invalid Timestamp ID"
                : "Timestamp ID"
            }
            variant="filled"
            value={timestampId}
            onChange={onTimestampIdChange}
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            className={classes.root}
            variant="filled"
            label="Public Address that signed the document"
            value={publicAddress}
            onChange={onPublicAddressChange}
          />
        </Grid>
      </Grid>
      <Grid className={classes.root}>
        {selectedTimestamp && !selectedTimestamp.cid ? (
          <div style={{ padding: 16, marginTop: 16 }}>
            <Typography align="center" variant="body1">
              Please provide a local file as this timestamp does not specify a
              content identifier...
            </Typography>
            <CustomDropzone
              onDrop={onDrop}
              text={file ? `Selected file: '${file.name}'` : undefined}
            />
          </div>
        ) : undefined}
      </Grid>
      <Button
        color="secondary"
        disabled={
          !publicAddress ||
          !timestampId ||
          timestampId >= timestampCount ||
          (selectedTimestamp && !selectedTimestamp.cid && !file)
        }
        fullWidth
        onClick={validateTimestamp}
        style={{ margin: 16 }}
      >
        Validate Timestamp
      </Button>
      <Typography
        align="center"
        variant="h6"
        style={{ color: validationSuccess === true ? "green" : "red" }}
      >
        {validationSuccess !== undefined
          ? validationSuccess === true
            ? "Timestamp was created by the given public address."
            : "Timestamp WAS NOT created by the given public address."
          : undefined}
      </Typography>
    </div>
  );
}

export default ValidatingArea;
