import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import DashboardArea from "../Dashboard/DashboardArea";
import Footer from "../Footer";
import Header from "../Header";
import IdentityArea from "../Identity/IdentityArea";
import TimestampDetailsDialog from "../TimestampDetails/TimestampDetailsDialog";
import TimestampingArea from "../Timestamping/TimestampingArea";
import ValidatingArea from "../Validating/ValidatingArea";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "95vw",
    minHeight: "100vh",
  },
  container: {
    marginTop: theme.spacing(1),
  },
  item: {
    width: "100%",
  },
  heading: {
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function parseTimestampIDFromURL(location) {
  if (location.pathname.includes("view")) {
    const parts = location.pathname.split("/");
    const id = Number(parts[parts.length - 1]);
    if (!isNaN(id)) {
      return id;
    } else {
      return undefined;
    }
  }
}

function IndexPage(props) {
  const classes = useStyles();

  const [timestampId, setTimestampId] = React.useState(undefined);

  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    setTimestampId(parseTimestampIDFromURL(location));
  }, [location]);

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <Grid className={classes.container} container spacing={3}>
        <Grid className={classes.item} item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography className={classes.heading} variant="h5" align="center">
              Dashboard
            </Typography>
            <DashboardArea />
          </Paper>
        </Grid>
        <Grid className={classes.item} item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography className={classes.heading} variant="h5" align="center">
              Timestamping
            </Typography>
            <TimestampingArea />
          </Paper>
        </Grid>
        <Grid className={classes.item} item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography className={classes.heading} variant="h5" align="center">
              Validating
            </Typography>
            <ValidatingArea />
          </Paper>
        </Grid>
        <Grid className={classes.item} item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography className={classes.heading} variant="h5" align="center">
              Identity management
            </Typography>
            <IdentityArea />
          </Paper>
        </Grid>
      </Grid>
      <TimestampDetailsDialog
        timestampId={timestampId}
        open={timestampId !== undefined}
        onClose={() => history.push("/")}
      />
      <Footer />
    </Container>
  );
}

export default IndexPage;
