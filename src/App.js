import React from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  SvgIcon,
} from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ReactComponent as GitHubLogo } from "./github.svg";
import { ReactComponent as ContentCutLogo } from "./content-cut.svg";
import { ReactComponent as ScissorsCuttingLogo } from "./scissors-cutting.svg";

const apiUrl = "http://localhost:8000/";
const errors = {
  empty: "This field is required!",
  invalidUrl: "This URL is invalid!",
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1) + " 0",
      width: "30ch",
    },
  },
  buttonProgress: {
    position: "absolute",
    // top: "50%",
    // left: "50%",
    // marginTop: -12,
    // marginLeft: -12,
  },
  wrapper: {
    // margin: theme.spacing(1),
    position: "relative",
    alignItems: "center",
  },
}));

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

class AppClass extends React.Component {
  state = {
    longform: { value: "", error: false, helperText: null },
    shortform: { value: "", error: false, helperText: null },
    snackbar: { open: false, message: "" },
    loading: false,
    success: false,
  };

  validate(event) {
    event.preventDefault();
    // Reset
    this.setState({
      longform: {
        ...this.state.longform,
        error: false,
        helperText: null,
      },
      shortform: {
        ...this.state.shortform,
        error: false,
        helperText: null,
      },
    });

    // Check empty
    if (this.state.longform.value === "") {
      this.setState({
        longform: {
          ...this.state.longform,
          error: true,
          helperText: errors.empty,
        },
      });
      return;
    }
    if (this.state.shortform.value === "") {
      this.setState({
        shortform: {
          ...this.state.shortform,
          error: true,
          helperText: errors.empty,
        },
      });
      return;
    }

    // Check URL
    if (!isValidHttpUrl(this.state.longform.value)) {
      this.setState({
        longform: {
          ...this.state.longform,
          error: true,
          helperText: errors.invalidUrl,
        },
      });
      return;
    }

    this.submit();
  }

  submit() {
    this.setState({ loading: true });
    fetch(apiUrl + "create", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        longform: this.state.longform.value,
        shortform: this.state.shortform.value,
      }),
    })
      .then((response) => {
        response.json().then((responseJson) => {
          this.setState({
            loading: false,
            snackbar: {
              ...this.state.snackbar,
              open: true,
              message: responseJson.message,
            },
          });
          if (!responseJson.success) {
            this.setState({
              success: false,
              shortform: { ...this.state.shortform, value: "" },
            });
          } else {
            this.setState({
              success: true,
              longform: { ...this.state.longform, value: "" },
              shortform: { ...this.state.shortform, value: "" },
            });
          }
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          success: false,
          snackbar: {
            ...this.state.snackbar,
            open: true,
            message: "Unknown error: " + error,
          },
        });
      });
  }

  render() {
    return (
      <>
        <div className="App center">
          <Typography variant="h4" component="h2" gutterBottom>
            Ycml.ml
          </Typography>
          <form
            className={this.props.classes.root}
            onSubmit={(event) => this.validate(event)}
            autoComplete="off"
            noValidate
            action="submitted"
          >
            <div style={{ flexDirection: "column" }}>
              <TextField
                label="Long URL"
                type="url"
                error={this.state.longform.error}
                helperText={this.state.longform.helperText}
                value={this.state.longform.value}
                onChange={(event) => {
                  this.setState({
                    longform: {
                      ...this.state.longform,
                      value: event.target.value,
                    },
                  });
                }}
              />
              <br />
              <br />
              <TextField
                label="Alias"
                error={this.state.shortform.error}
                helperText={this.state.shortform.helperText}
                value={this.state.shortform.value}
                onChange={(event) => {
                  this.setState({
                    shortform: {
                      ...this.state.shortform,
                      value: event.target.value,
                    },
                  });
                }}
              />
              <br />
              <br />
              <div className={this.props.classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={this.state.loading}
                  startIcon={
                    this.state.loading ? (
                      <CircularProgress size={24} color="white" />
                    ) : (
                      <SvgIcon
                        component={
                          this.state.success
                            ? ScissorsCuttingLogo
                            : ContentCutLogo
                        }
                      />
                    )
                  }
                >
                  Shorten
                </Button>
                {/* {this.state.loading && (
                  <CircularProgress
                    size={24}
                    className={this.props.classes.buttonProgress}
                  />
                )} */}
              </div>

              {/* <br />
              <br />
              <Button variant="outlined" startIcon={<GitHubLogo />}>
                Star on GitHub
              </Button> */}
            </div>
          </form>
        </div>
        <Snackbar
          open={this.state.snackbar.open}
          onClose={() =>
            this.setState({ snackbar: { ...this.state.snackbar, open: false } })
          }
          message={this.state.snackbar.message}
        />
      </>
    );
  }
}

function App(props) {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppClass classes={classes} {...props} />
    </ThemeProvider>
  );
}

export default App;
