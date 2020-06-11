import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useHeaderStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(3),
    flexGrow: 1,
  },
  button: {
    height: "fit-content",
    alignSelf: "center",
  },
  icon: {
    fontSize: "130%",
  },
}));

function Header() {
  const classes = useHeaderStyles();

  return (
    <Box display="flex" flexDirection="row">
      <Typography
        className={classes.typography}
        variant="h2"
        align="center"
        color="secondary"
      >
        Proof-of-time Machine
      </Typography>
    </Box>
  );
}

export default Header;
