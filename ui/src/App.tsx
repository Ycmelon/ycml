import React, { useState, useMemo, FC } from "react";

import {
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  SvgIcon,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CssBaseline from "@material-ui/core/CssBaseline";
import { GitHubLogo, ContentCutLogo, ScissorsCuttingLogo } from "./assets";

const apiUrl = "https://ycml.ml/";

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
}));

function verifyURL(string: string): boolean {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

interface SnackbarState {
  open: boolean;
  message?: string;
}

interface InputState {
  value?: string;
  error?: boolean;
  helperText?: string;
}

const emptyInputState: InputState = {
  value: "",
  error: false,
  helperText: undefined,
};

const App: FC<{ classes: any }> = (props: { classes: any }) => {
  const [longform, setLongform] = useState<InputState>(emptyInputState);
  const [shortform, setShortform] = useState<InputState>(emptyInputState);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function setInput(type: "longform" | "shortform", state: InputState) {
    if (type === "longform")
      setLongform((previous) => ({ ...previous, ...state }));
    else if (type === "shortform")
      setShortform((previous) => ({ ...state, ...state }));
  }

  function validateAndSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Reset
    setInput("longform", { error: false, helperText: undefined });
    setInput("shortform", { error: false, helperText: undefined });

    // Check empty
    if (!longform.value) {
      setInput("longform", { error: true, helperText: errors.empty });
      return;
    } else if (!shortform.value) {
      setInput("shortform", { error: true, helperText: errors.empty });
      return;
    }

    // Check URL
    if (!verifyURL(longform.value)) {
      setInput("longform", { error: true, helperText: errors.invalidUrl });
      return;
    }

    submit(longform.value, shortform.value);
  }

  async function submit(longform: string, shortform: string) {
    let response, responseJson;
    try {
      setLoading(true);
      response = await fetch(apiUrl + "create", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          longform: longform,
          shortform: shortform,
        }),
      });
      responseJson = await response.json();
    } catch (error) {
      setSnackbar({ open: true, message: "error" });
    } finally {
      setLoading(false);
    }

    setSnackbar({ open: true, message: responseJson.message });
    setSuccess(responseJson.success);

    // Clear inputs & copy to clipboard
    setInput("shortform", { value: "" });
    if (responseJson.success) {
      setInput("longform", { value: "" });
      await navigator.clipboard.writeText(apiUrl + shortform);
    }
  }

  return (
    <>
      <div className="center">
        <Typography variant="h4" component="h2" gutterBottom>
          <span role="img" aria-label="Watermelon emoji">
            🍉
          </span>{" "}
          Ycml.ml
        </Typography>
        <form
          className={props.classes.root}
          onSubmit={validateAndSubmit}
          autoComplete="off"
          noValidate
          action="submitted"
        >
          <div className="container">
            <TextField
              {...longform}
              label="Long URL"
              type="url"
              placeholder="https://www.example.com/"
              onChange={(event) =>
                setInput("longform", { value: event.target.value })
              }
            />
            <TextField
              {...shortform}
              label="Alias"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">ycml.ml/</InputAdornment>
                ),
              }}
              onChange={(event) =>
                setInput("shortform", { value: event.target.value })
              }
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SvgIcon
                      component={success ? ScissorsCuttingLogo : ContentCutLogo}
                    />
                  )
                }
              >
                Shorten
              </Button>{" "}
              <IconButton href="https://github.com/Ycmelon/ycml">
                <SvgIcon component={GitHubLogo} />
              </IconButton>
            </div>
          </div>
        </form>
      </div>

      <Snackbar {...snackbar} onClose={() => setSnackbar({ open: false })} />
    </>
  );
};

export default (props: any) => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
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
      <App classes={classes} {...props} />
    </ThemeProvider>
  );
};
