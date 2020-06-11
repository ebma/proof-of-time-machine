import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TimestampingPanels from "./TimestampingPanels";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function TimestampingArea() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TimestampingPanels />
    </div>
  );
}

export default TimestampingArea;
