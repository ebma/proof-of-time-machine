import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { PropTypes } from "prop-types";
import React from "react";

const infoStyles = makeStyles((theme) => ({
  typographyItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  },
}));

function TimestampDetailsInfo({ timestamp }) {
  const classes = infoStyles();
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>ID</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">{timestamp.id}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>Signature</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">{timestamp.signature}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>Content Identifier</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">
            {timestamp.cid ? timestamp.cid : "-"}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>Extra</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">
            {timestamp.extra ? timestamp.extra : "-"}
          </Typography>
        </Grid>
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
            <TimestampDetailsInfo timestamp={timestamp} />
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
  timestamp: PropTypes.any.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default TimestampDetailsDialog;
