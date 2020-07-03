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
import ShareArea from "./ShareArea";
import TimestampDetails from "./TimestampDetails";
import FileRetrievalArea from "./FileRetrievalArea";

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
  const { open, timestamp, onClose } = props;

  const classes = useStyles();

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
            <ShareArea timestamp={timestamp} />
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
