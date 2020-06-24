import React from "react";
import { PropTypes } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IPFSTimestampControls from "./IPFSTimestampControls";
import SimpleTimestampControls from "./SimpleTimestampControls";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

function SimpleTimestampPanel(props) {
  const classes = useStyles();

  return (
    <ExpansionPanel expanded={props.expanded} onChange={props.onChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography className={classes.heading}>Simple Timestamp</Typography>
        <Typography className={classes.secondaryHeading}>
          Create a simple timestamp of your document
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <SimpleTimestampControls file={props.file} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

SimpleTimestampPanel.propTypes = {
  expanded: PropTypes.bool.isRequired,
  file: PropTypes.any,
  onChange: PropTypes.func,
};

function IPFSTimestampPanel(props) {
  const classes = useStyles();

  return (
    <ExpansionPanel expanded={props.expanded} onChange={props.onChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
      >
        <Typography className={classes.heading}>Timestamp with IPFS</Typography>
        <Typography className={classes.secondaryHeading}>
          Create a timestamp of your document while sharing it on IPFS
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <IPFSTimestampControls file={props.file} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

IPFSTimestampPanel.propTypes = {
  expanded: PropTypes.bool.isRequired,
  file: PropTypes.any,
  onChange: PropTypes.func,
};

function EncryptedIPFSTimestampPanel(props) {
  const classes = useStyles();

  return (
    <ExpansionPanel expanded={props.expanded} onChange={props.onChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3bh-content"
        id="panel3bh-header"
      >
        <Typography className={classes.heading}>
          Timestamp with IPFS (encrypted)
        </Typography>
        <Typography className={classes.secondaryHeading}>
          Create a timestamp of your <b>encrypted</b> document while sharing it
          on IPFS
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
          varius pulvinar diam eros in elit. Pellentesque convallis laoreet
          laoreet.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

EncryptedIPFSTimestampPanel.propTypes = {
  expanded: PropTypes.bool.isRequired,
  file: PropTypes.any,
  onChange: PropTypes.func,
};

function TimestampingPanels(props) {
  const { file } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <SimpleTimestampPanel
        expanded={expanded === "panel1"}
        file={file}
        onChange={handleChange("panel1")}
      />
      <IPFSTimestampPanel
        expanded={expanded === "panel2"}
        file={file}
        onChange={handleChange("panel2")}
      />
      <EncryptedIPFSTimestampPanel
        expanded={expanded === "panel3"}
        file={file}
        onChange={handleChange("panel3")}
      />
    </div>
  );
}

TimestampingPanels.propTypes = { file: PropTypes.any.isRequired };

export default TimestampingPanels;
