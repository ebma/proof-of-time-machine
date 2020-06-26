import { drizzleReactHooks } from "@drizzle/react-plugin";
import React from "react";
import {
  Button,
  TextField,
  Grid,
  Typography
} from "@material-ui/core";
import EthCrypto from "eth-crypto";
import CustomDropzone from "../Timestamping/Dropzone";
import { makeStyles } from "@material-ui/core/styles";
import BufferList from "bl/BufferList";
import { AppContext } from "../../contexts/app";
import Eth from "ethjs";
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

  const [timestamps, setTimestamps] = React.useState([]);
  const [timestampCount, setTimestampCount] = React.useState(0);

  React.useMemo(() => {
    let timestampArr = [];
    for (let key in timestampStore.timestamps) {
      timestampArr.push(timestampStore.timestamps[key].value);
    }
    setTimestamps(timestampArr);
  }, [timestampStore.timestamps]);

  React.useMemo(() => {
    if ("0x0" in timestampStore.getTimestampCount) {
      setTimestampCount(parseInt(timestampStore.getTimestampCount["0x0"].value));
    }
  }, [timestampStore.getTimestampCount]);

  TimestampFactory.methods.getTimestampCount.cacheCall();

  const [timestampId, setTimestampId] = React.useState("");
  const [publicAddress, setPublicAddress] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [file, setFile] = React.useState(undefined);
  const [fileContent, setFileContent] = React.useState(undefined);
  const [claimValidString, setClaimValidString] = React.useState("");

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
    }
  }, []);

  const onTimestampIdChange = (e) => {
    setTimestampId(e.target.value);
  };

  const onPublicAddressChange = (e) => {
    setPublicAddress(e.target.value);
  };

  const onPrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
  };

  React.useEffect(() => {
    if (!file) {
      return;
    }
    console.log("reading file");
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      setFileContent(buffer.toString());
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  async function downloadIPFSFile(cid) {
    let fileBuffer = new BufferList();
    for await (const result of ipfsClient.get(cid)) {
      for await (const chunk of result.content) {
        fileBuffer.append(chunk);
      }
      return fileBuffer.toString();
    }
  }

  const validateTimestamp = async () => {
    if (timestampId >= timestampCount) {
      alert("Invalid timestamp ID!");
    } else {
      let originalFile = fileContent;
      if (timestamps[timestampId].cid) {
        // file was uploaded to ipfs
        originalFile = await downloadIPFSFile(timestamps[timestampId].cid);
        if (privateKey) {
          // private key given, so assume file was encrypted
          EthCrypto.decryptWithPrivateKey(privateKey, fileContent)
          .then(setFileContent);
        }
      } else if (!fileContent) {
        setClaimValidString("Please provide a local file, as this file does not exist on IPFS.");
        return;
      }

      const eth = new Eth(web3.givenProvider);
      let recoveredAddress = "";
      await eth.personal_ecRecover(originalFile, timestamps[timestampId].signature)
        .then((returnedAddress) => {recoveredAddress = returnedAddress});

      if (recoveredAddress === publicAddress) {
        setClaimValidString("Timestamp was created by the given public address.");
      } else {
        setClaimValidString("Timestamp WAS NOT created by the given public address.");
      }
    }
  };

  return (
    <div className={classes.root}>
      <CustomDropzone
        onDrop={onDrop}
        text={file ? `Selected file: '${file.name}'` : undefined}
      />
      {file ? (
        <Button onClick={() => {setFile(); setFileContent()}}>
          Clear file
        </Button>
      ) : undefined}

      <br/>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <TextField
            label="Timestamp ID"
            variant="filled"
            value={timestampId}
            onChange={onTimestampIdChange}
          />
        </Grid>
        <Grid item xs>
          <TextField className={classes.root}
            variant="filled"
            label="Public Address that signed the document"
            value={publicAddress}
            onChange={onPublicAddressChange}
          />
        </Grid>
      </Grid>
      <br />
      <Grid className={classes.root}>
        <TextField className={classes.root}
          variant="filled"
          label="(Optional) Private Key that was used to encrypt the document"
          value={privateKey}
          onChange={onPrivateKeyChange}
        />
      </Grid>
      <Button color="secondary"
        disabled = {!publicAddress || !timestampId}
        onClick={validateTimestamp}
      >
        Validate Timestamp
      </Button>
      <Typography variant="body1">
        {claimValidString}
      </Typography>
    </div>
  );
}

export default ValidatingArea;
