import React, { useState, FC } from "react";
import { SnackbarState, InputState } from "../types";

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

import { GitHubLogo, ContentCutLogo, ScissorsCuttingLogo } from "../assets";
import {
  emptyInputState,
  messages,
  verifyURL,
  baseUrl,
  useStyles,
} from "../constants";

import firebase_ from "firebase/app";
import "firebase/firestore";

const Create: FC = () => {
  const classes = useStyles();

  const firebase = firebase_.apps[0];
  const db = firebase.firestore();

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
    setSuccess(false);

    // Reset
    setInput("longform", { error: false, helperText: undefined });
    setInput("shortform", { error: false, helperText: undefined });

    // Check empty
    if (!longform.value) {
      setInput("longform", { error: true, helperText: messages.empty });
      return;
    } else if (!shortform.value) {
      setInput("shortform", { error: true, helperText: messages.empty });
      return;
    }

    // Check URL
    if (!verifyURL(longform.value)) {
      setInput("longform", { error: true, helperText: messages.invalidUrl });
      return;
    }

    submit(longform.value, shortform.value);
  }

  async function submit(longform: string, shortform: string) {
    setLoading(true);

    try {
      const checkQuery = await db
        .collection("urls")
        .where("alias", "==", shortform)
        .get();
      if (!checkQuery.empty) {
        setSnackbar({ open: true, message: messages.taken });
        setInput("shortform", { value: "" });
        return;
      }
      await db.collection("urls").add({ url: longform, alias: shortform });

      setSuccess(true);
      setSnackbar({ open: true, message: messages.success });
      setInput("longform", { value: "" });
      await navigator.clipboard.writeText(baseUrl + shortform);
    } catch (error) {
      setSnackbar({ open: true, message: `Unknown error: ${error}` });
    } finally {
      setLoading(false);
      setInput("shortform", { value: "" });
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
          className={classes.root}
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

export default Create;
