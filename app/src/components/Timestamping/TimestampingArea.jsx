import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import TimestampingPanels from "./TimestampingPanels";
import CustomDropzone from "./Dropzone";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function TimestampingArea() {
  const classes = useStyles();

  const [file, setFile] = React.useState(undefined);

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
    }
  }, []);

  return (
    <div className={classes.root}>
      <CustomDropzone
        onDrop={onDrop}
        text={file ? `Selected file: '${file.name}'` : undefined}
      />

      {file ? (
        <Box style={{ padding: 16 }}>
          <TimestampingPanels file={file} />
        </Box>
      ) : undefined}
    </div>
  );
}

export default TimestampingArea;
