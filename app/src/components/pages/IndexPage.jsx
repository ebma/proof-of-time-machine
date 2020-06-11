import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import IdentityArea from "../Identity/IdentityArea";
import Footer from "../Footer";
import Header from "../Header";
import TimestampingArea from "../Timestamping/TimestampingArea";
import { Typography } from "@material-ui/core";

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

function IndexPage(props) {
  const classes = useStyles();

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <Grid className={classes.container} container spacing={3}>
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
              Identity management
            </Typography>
            <IdentityArea />
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
}

IndexPage.propTypes = { drizzle: PropTypes.any, drizzleState: PropTypes.any };

export default IndexPage;
