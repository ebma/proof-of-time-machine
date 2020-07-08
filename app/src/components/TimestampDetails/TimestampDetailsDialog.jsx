import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { PropTypes } from "prop-types";
import React from "react";
import { AppContext } from "../../contexts/app";
import FileRetrievalArea from "./FileRetrievalArea";
import ShareArea from "./ShareArea";
import TimestampDetails from "./TimestampDetails";

const useStyles = makeStyles((theme) => ({
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
  const { open, timestampId, onClose } = props;
  const classes = useStyles();

  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { TimestampFactory } = drizzle.contracts;

  const { currentAccount } = React.useContext(AppContext);

  const [timestamp, setTimestamp] = React.useState(null);
  const [ownedTimestamps, setOwnedTimestamps] = React.useState([]);

  console.log("ownedTimestamps", ownedTimestamps);

  React.useEffect(() => {
    try {
      TimestampFactory.methods
        .timestamps(timestampId)
        .call()
        .then(setTimestamp)
        .catch(console.error);
    } catch (error) {
      console.error(error.message);
    }
  }, [TimestampFactory.methods, timestampId]);

  React.useEffect(() => {
    try {
      TimestampFactory.methods
        .getTimestampsByOwner(currentAccount)
        .call()
        .then(setOwnedTimestamps)
        .catch(console.error);
    } catch (error) {
      console.error(error.message);
    }
  }, [TimestampFactory.methods, currentAccount]);

  return (
    <div>
      {timestamp ? (
        <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
          <DialogTitle id="alert-dialog-slide-title">
            Timestamp Details
          </DialogTitle>
          <DialogContent className={classes.root}>
            <TimestampDetails timestamp={timestamp} timestampId={timestampId} />
            {ownedTimestamps.includes(String(timestampId)) ? (
              <>
                <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                <ShareArea timestampId={timestampId} />
              </>
            ) : undefined}
            {timestamp.cid ? (
              <>
                <Divider style={{ marginTop: 16, marginBottom: 16 }} />
                <FileRetrievalArea cid={timestamp.cid} />
              </>
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
