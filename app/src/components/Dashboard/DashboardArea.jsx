import { Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AccountControls from "./AccountControls";
import TimestampOverview from "./TimestampOverview";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  divider: {
    margin: theme.spacing(1),
  },
}));

function DashboardArea() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <AccountControls />
      <Divider className={classes.divider} />
      <TimestampOverview />
    </Box>
  );
}

export default DashboardArea;
