import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AccountControls from "./AccountControls";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function DashboardArea() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <AccountControls />
    </Box>
  );
}

export default DashboardArea;
