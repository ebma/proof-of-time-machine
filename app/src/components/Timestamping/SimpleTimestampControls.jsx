import React from "react";
import { PropTypes } from "prop-types";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Button } from "@material-ui/core";

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

  const [hash, setHash] = React.useState("");
  const [signedHash, setSignedHash] = React.useState();

  const onCreateHash = React.useCallback(() => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const fileContent = reader.result;
      const hash = drizzle.web3.utils.sha3(fileContent);
      setHash(hash);
    };
    reader.readAsText(file);
  }, [drizzle.web3.utils, file]);

  const onSignHash = React.useCallback(() => {
    drizzle.web3.eth.personal
      .sign(hash, drizzle.web3.eth.defaultAccount)
      .then(setSignedHash);
  }, [drizzle.web3.eth.defaultAccount, drizzle.web3.eth.personal, hash]);

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <Grid display="flex" container spacing={3}>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            fullWidth
            label="Hash"
            value={hash}
          />
          <Button className={classes.button} onClick={onCreateHash}>
            Create hash
          </Button>
        </Grid>
        <Grid className={classes.item} item sm={12} xs={12}>
          <TextField
            className={classes.textField}
            disabled={true}
            label="Signed hash"
            value={signedHash}
          />
          <Button
            className={classes.button}
            disabled={!hash}
            onClick={onSignHash}
          >
            Sign hash
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
