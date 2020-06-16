import { drizzleReactHooks } from "@drizzle/react-plugin";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function IdentityArea() {
  const classes = useStyles();
  const {
    drizzle,
    useCacheCall,
    useCacheEvents,
    useCacheSend,
  } = drizzleReactHooks.useDrizzle();

  console.log(drizzle, useCacheCall, useCacheEvents, useCacheSend);

  return <div className={classes.root}>...</div>;
}

export default IdentityArea;
