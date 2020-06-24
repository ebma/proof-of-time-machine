import { drizzleReactHooks } from "@drizzle/react-plugin";
import {
  Box,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

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
              primary={`${claim.name} | ${claim.email}`}
              secondary={claim.pubkey}
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
  }, [IdentityService.methods.claims, claimCount]);

  IdentityService.methods.getClaimCount.cacheCall();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCreateClaim = () => {
    IdentityService.methods
      .createClaim(name, email)
      .send()
      .on("transactionHash", (transactionHash) => {
        alert("Success! TX Hash: " + transactionHash);
      })
      .on("error", (err) => {
        alert(err.message);
      });
  };

  return (
    <Box align="center">
      <Grid>
        <TextField
          label="Name"
          variant="filled"
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          variant="filled"
          label="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <Button color="secondary" onClick={handleCreateClaim}>
          Create Claim
        </Button>
      </Grid>
      <Box className={classes.box}>
        <Typography align="left">Claims:</Typography>
      </Box>
      <ClaimList claims={claims} />
    </Box>
  );
}

export default IdentityArea;
