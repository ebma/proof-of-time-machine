import React from "react";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header";
import Footer from "../Footer";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "95vw",
    minHeight: "100vh",
  },
  container: {
    marginTop: 16,
  },
  item: {
    width: "100%",
  },
}));

function IndexPage(props) {
  const classes = useStyles();

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <Footer />
    </Container>
  );
}

IndexPage.propTypes = { drizzle: PropTypes.any, drizzleState: PropTypes.any };

export default IndexPage;
