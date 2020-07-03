import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import TimestampDetails from "../TimestampDetails/TimestampDetails";
import CustomDropzone from "../Timestamping/Dropzone";
import { Base64 } from "js-base64";

function ClaimInfo({ claimOwner }) {
  const [claimInfo, setClaimInfo] = React.useState(undefined);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { IdentityService } = drizzle.contracts;

  React.useEffect(() => {
    try {
      IdentityService.methods
        .getUserClaimId(claimOwner)
        .call()
        .then((claimID) => {
          console.log("claimID", claimID);
          IdentityService.methods
            .claims(claimID)
            .call()
            .then(setClaimInfo)
            .catch(console.error);
        })
        .catch(console.error);
    } catch (error) {
      console.error(error.message);
      setClaimInfo(undefined);
    }
  }, [claimOwner, IdentityService.methods]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {claimInfo ? (
        <Box style={{ padding: 16, textAlign: "center" }}>
          <Typography variant="h6">Claim Info</Typography>
          <Typography>
            <b>Name: </b>
            {claimInfo.name}
          </Typography>
          <Typography>
            <b>Email: </b>
            {claimInfo.email}
          </Typography>
        </Box>
      ) : (
        <Typography>No claim found for this address </Typography>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flexGrow: 1,
  },
}));

function ValidatingArea() {
  const classes = useStyles();
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
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id) {
      setTimestampId(id);
    }

    const address = url.searchParams.get("address");
    if (address) {
      setPublicAddress(address);
    }
  }, []);

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
      setFileContent(buffer);
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

  const validateTimestamp = React.useCallback(async () => {
    let originalMessage;
    if (selectedTimestamp.cid) {
      originalMessage = selectedTimestamp.cid;
    } else {
      const contentString = Base64.fromUint8Array(new Uint8Array(fileContent));
      originalMessage = web3.utils.sha3(contentString);
    }

    const recoveredAddress = await web3.eth.personal.ecRecover(
      originalMessage,
      selectedTimestamp.signature
    );

    if (recoveredAddress === publicAddress) {
      setValidationSuccess(true);
    } else {
      setValidationSuccess(false);
    }
  }, [
    fileContent,
    selectedTimestamp,
    publicAddress,
    web3.utils,
    web3.eth.personal,
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
            error={Boolean(timestampId) && timestampId >= timestampCount}
            label={
              timestampId >= timestampCount
                ? "Invalid Timestamp ID"
                : "Timestamp ID"
            }
            fullWidth
            variant="filled"
            value={timestampId}
            onChange={onTimestampIdChange}
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            fullWidth
            className={classes.root}
            variant="filled"
            label="Public Address that signed the document"
            value={publicAddress}
            onChange={onPublicAddressChange}
          />
        </Grid>
      </Grid>
      {publicAddress ? <ClaimInfo claimOwner={publicAddress} /> : undefined}
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
      {selectedTimestamp ? (
        <div style={{ padding: 16, margin: 16 }}>
          <TimestampDetails timestamp={selectedTimestamp} />
        </div>
      ) : undefined}
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
