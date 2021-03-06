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
  const [fileContent, setFileContent] = React.useState(new ArrayBuffer());

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
    }
  }, []);

  React.useEffect(() => {
    if (!file) return;

    file.arrayBuffer().then((contentBuffer) => {
      setFileContent(contentBuffer);
    });
  }, [file]);

  return (
    <div className={classes.root}>
      <CustomDropzone
        onDrop={onDrop}
        text={file ? `Selected file: '${file.name}'` : undefined}
      />

      {file ? (
        <Box style={{ padding: 16 }}>
          <TimestampingPanels file={file} fileContent={fileContent} />
        </Box>
      ) : undefined}
    </div>
  );
}

export default TimestampingArea;
