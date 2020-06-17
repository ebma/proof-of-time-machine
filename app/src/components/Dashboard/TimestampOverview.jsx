import { drizzleReactHooks } from "@drizzle/react-plugin";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SyncIcon from "@material-ui/icons/Sync";
import PropTypes from "prop-types";
import React from "react";

const useListStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    padding: theme.spacing(3),
  },
  text: {},
}));

function TimestampList(props) {
  const { timestamps } = props;
  const classes = useListStyles();

  const TimestampList = React.useMemo(() => {
    return timestamps.map((timestamp, index) => (
      <div key={timestamp.id}>
        {index > 0 ? <Divider /> : undefined}
        <ListItem>
          <ListItemText
            className={classes.text}
            primary={timestamp.signedHash}
            secondary={`IPFS?: ${timestamp.ipfs}`}
            primaryTypographyProps={{
              style: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              },
            }}
          />
        </ListItem>
      </div>
    ));
  }, [classes.text, timestamps]);

  return (
    <Paper>
      <List dense className={classes.root}>
        {TimestampList}
      </List>
    </Paper>
  );
}

TimestampList.propTypes = {
  timestamps: PropTypes.array.isRequired,
};

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },
}));

function TimestampOverview() {
  const classes = useStyles();
  const [timestampByOwnerCallID, setTimestampsByOwnerCallID] = React.useState(
    undefined
  );
  const [
    selectedTimestampCallIDs,
    setSelectedTimestampCallIDs,
  ] = React.useState([]);
  const [selectedTimestamps, setSelectedTimestamps] = React.useState([]);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { TimestampFactory } = drizzle.contracts;

  const timestampStore = drizzleReactHooks.useDrizzleState((drizzleState) => ({
    ...drizzleState.contracts.TimestampFactory,
  }));

  const onFetch = React.useCallback(() => {
    const callID = TimestampFactory.methods.getTimestampsByOwner.cacheCall(
      window.web3.eth.defaultAccount
    );

    setTimestampsByOwnerCallID(callID);
  }, [TimestampFactory.methods.getTimestampsByOwner]);

  React.useEffect(() => {
    const timestampIndices =
      timestampStore.getTimestampsByOwner[timestampByOwnerCallID];
    if (timestampIndices && timestampIndices.value) {
      const callIDs = [];
      for (const id of timestampIndices.value) {
        const callID = TimestampFactory.methods.timestamps.cacheCall(id);
        callIDs.push(callID);
      }
      setSelectedTimestampCallIDs(callIDs);
    }
  }, [
    timestampStore.getTimestampsByOwner,
    TimestampFactory.methods.timestamps,
    timestampByOwnerCallID,
  ]);

  React.useEffect(() => {
    const augmentedTimestamps = [];
    for (const timestampCallID of selectedTimestampCallIDs) {
      const timestamp = timestampStore.timestamps[timestampCallID];
      if (timestamp) {
        const timestampWithID = { ...timestamp.value, id: timestampCallID };
        augmentedTimestamps.push(timestampWithID);
      }
    }
    setSelectedTimestamps(augmentedTimestamps);
  }, [selectedTimestampCallIDs, timestampStore.timestamps]);

  return (
    <Box align="center">
      <Box className={classes.box}>
        <Typography>Timestamps owned by your account:</Typography>
        <Button
          className={classes.button}
          color="secondary"
          startIcon={<SyncIcon />}
          variant="contained"
          onClick={onFetch}
        >
          Fetch
        </Button>
      </Box>
      <TimestampList timestamps={selectedTimestamps} />
    </Box>
  );
}

export default TimestampOverview;
