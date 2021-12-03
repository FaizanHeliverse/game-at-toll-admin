import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";

export default function CustomizedSnackbars(props) {
  console.log("Customized snackbars");

  const [state, setState] = React.useState({
    open: props.open,
    Transition: Fade,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  React.useEffect(() => {
    setState({
      open: props.open,
      Fade,
    });
  }, [props.open]);
  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={props.message}
        autoHideDuration={6000}
      />
      )
    </div>
  );
}
