import React from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import RootRef from "@material-ui/core/RootRef";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    textAlign: "center",
  },
}));

function CustomDropzone(props) {
  const classes = useStyles();

  const { getRootProps, getInputProps } = useDropzone({ onDrop: props.onDrop });
  const { ref, ...rootProps } = getRootProps();

  return (
    <RootRef rootRef={ref}>
      <Paper className={classes.root} {...rootProps}>
        <input {...getInputProps()} />
        {props.text ? (
          props.text
        ) : (
          <p>Drop file here or click to select files</p>
        )}
      </Paper>
    </RootRef>
  );
}

CustomDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  text: PropTypes.string,
};

export default CustomDropzone;
