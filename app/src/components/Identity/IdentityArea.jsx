import { drizzleReactHooks } from "@drizzle/react-plugin";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import React from "react";
import { AppContext } from "../../contexts/app";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

const useListStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    width: "100%",
    padding: theme.spacing(3),
  },
  text: {},
}));

function ClaimList(props) {
  const { claims } = props;
  const classes = useListStyles();

  const ClaimList = React.useMemo(() => {
    return claims.length ? (
      claims.map((claim, index) => (
        <div key={claim.pubkey}>
          {index > 0 ? <Divider /> : undefined}
          <ListItem>
            <ListItemText
              className={classes.text}
              primary={`${claim.name} | ${claim.email}`}
              secondary={claim.pubkey}
              primaryTypographyProps={{
                style: {
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                },
              }}
            />
          </ListItem>
        </div>
      ))
    ) : (
      <Typography>No claims found</Typography>
    );
  }, [claims]);

  return (
    <Paper>
      <List dense className={classes.root}>
        {ClaimList}
      </List>
    </Paper>
  );
}

function IdentityArea() {
  const classes = useStyles();
  const { drizzle } = drizzleReactHooks.useDrizzle();
  const { currentAccount } = React.useContext(AppContext);
  const { IdentityService } = drizzle.contracts;

  const claimStore = drizzleReactHooks.useDrizzleState((drizzleState) => ({
    ...drizzleState.contracts.IdentityService,
  }));

  const [claims, setClaims] = React.useState([]);
  const [claimCount, setClaimCount] = React.useState(0);

  React.useEffect(() => {
    let claimArr = [];
    for (let key in claimStore.claims) {
      claimArr.push(claimStore.claims[key].value);
    }
    setClaims(claimArr);
  }, [claimStore.claims]);

  React.useEffect(() => {
    if ("0x0" in claimStore.getClaimCount) {
      setClaimCount(parseInt(claimStore.getClaimCount["0x0"].value));
    }
  }, [claimStore.getClaimCount]);

  React.useEffect(() => {
    for (let i = 0; i < claimCount; i++) {
      IdentityService.methods.claims.cacheCall(i);
    }
  }, [claimCount]);

  IdentityService.methods.getClaimCount.cacheCall();

  return (
    <Box align="center">
      <Box className={classes.box}>
        <Typography>Claims:</Typography>
      </Box>
      <ClaimList claims={claims} />
    </Box>
  );
}

export default IdentityArea;

/*
let instance = await IdentityService.deployed()
let accounts = await web3.eth.getAccounts()
instance.createClaim("paul", "paul@email.de", {from:accounts[0]})
*/
