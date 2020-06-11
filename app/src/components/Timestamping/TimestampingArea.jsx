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
  const [fileContent, setFileContent] = React.useState(undefined);

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const content = reader.result;
        setFileContent(content);
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  return (
    <div className={classes.root}>
      <CustomDropzone
        onDrop={onDrop}
        text={file ? `Selected file: '${file.name}'` : undefined}
      />

      {fileContent ? (
        <Box style={{ padding: 16 }}>
          <TimestampingPanels />
        </Box>
      ) : undefined}
    </div>
  );
}

export default TimestampingArea;
