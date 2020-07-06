import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  typographyItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  },
}));

function TimestampDetails({ timestamp, timestampId }) {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>ID</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">{timestampId}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" align="right">
            <b>Created on</b>
          </Typography>
        </Grid>
        <Grid className={classes.typographyItem} item xs={9}>
          <Typography variant="body1">
            {new Date(timestamp.timestamp * 1000).toUTCString()}
          </Typography>
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

export default TimestampDetails;
