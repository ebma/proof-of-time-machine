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
import PropTypes from "prop-types";
import React from "react";
import { AppContext } from "../../contexts/app";
import TimestampDetailsDialog from "../TimestampDetails/TimestampDetailsDialog";

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
  const { openDetails, timestamps } = props;
  const classes = useListStyles();

  const getSecondaryText = (timestamp) => {
    let text = "";
    text += timestamp.cid ? `CID: ${timestamp.cid}` : "";
    text += timestamp.cid && timestamp.extra ? " | " : "";
    text += timestamp.extra ? `Extra: ${timestamp.extra}` : "";
    return text;
  };

  const TimestampList = React.useMemo(() => {
    return timestamps.length ? (
      timestamps.map((timestamp, index) => (
        <div key={timestamp.id} style={{ width: "100%" }}>
          {index > 0 ? <Divider /> : undefined}
          <ListItem>
            <ListItemText
              className={classes.text}
              primary={`Signature: ${timestamp.signature}`}
              secondary={getSecondaryText(timestamp)}
              primaryTypographyProps={{
                style: {
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                },
              }}
            />
            <Button color="secondary" onClick={() => openDetails(timestamp)}>
              Details
            </Button>
          </ListItem>
        </div>
      ))
    ) : (
      <Typography>No timestamps found for your account...</Typography>
    );
  }, [classes.text, openDetails, timestamps]);

  return (
    <Paper>
      <List dense className={classes.root}>
        {TimestampList}
      </List>
    </Paper>
  );
}

TimestampList.propTypes = {
  openDetails: PropTypes.func.isRequired,
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

  const { currentAccount } = React.useContext(AppContext);

  const [timestampByOwnerCallID, setTimestampsByOwnerCallID] = React.useState(
    undefined
  );
  const [
    selectedTimestampCallIDs,
    setSelectedTimestampCallIDs,
  ] = React.useState([]);
  const [selectedTimestamps, setSelectedTimestamps] = React.useState([]);
  const [detailedTimestamp, setDetailedTimestamp] = React.useState(undefined);

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { TimestampFactory } = drizzle.contracts;

  const timestampStore = drizzleReactHooks.useDrizzleState((drizzleState) => ({
    ...drizzleState.contracts.TimestampFactory,
  }));

  React.useEffect(() => {
    if (currentAccount) {
      const callID = TimestampFactory.methods.getTimestampsByOwner.cacheCall(
        currentAccount
      );

      setTimestampsByOwnerCallID(callID);
    }
  }, [currentAccount, TimestampFactory.methods.getTimestampsByOwner]);

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
        const timestampWithID = {
          ...timestamp.value,
          id: timestamp.args[0],
          callID: timestampCallID,
        };
        augmentedTimestamps.push(timestampWithID);
      }
    }
    setSelectedTimestamps(augmentedTimestamps);
  }, [selectedTimestampCallIDs, timestampStore.timestamps]);

  const openDetails = React.useCallback((timestamp) => {
    setDetailedTimestamp(timestamp);
  }, []);

  console.log("timestampstore", timestampStore);

  return (
    <Box align="center">
      <Box className={classes.box}>
        <Typography>Timestamps owned by your account:</Typography>
      </Box>
      <TimestampList
        openDetails={openDetails}
        timestamps={selectedTimestamps}
      />
      <TimestampDetailsDialog
        timestamp={detailedTimestamp}
        open={Boolean(detailedTimestamp)}
        onClose={() => setDetailedTimestamp(undefined)}
      />
    </Box>
  );
}

export default TimestampOverview;
