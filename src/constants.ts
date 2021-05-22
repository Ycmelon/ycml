import { makeStyles } from "@material-ui/core/styles";
import { InputState } from "./types";

export const messages = {
  empty: "This field is required!",
  invalidUrl: "This URL is invalid!",
  taken: "This URL is taken!",
  success: "Successfully created & copied to clipboard!",
};

export const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1) + " 0",
      width: "30ch",
    },
  },
}));

export function verifyURL(string: string): boolean {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const baseUrl = "https://Ycml.ml/";

export const emptyInputState: InputState = {
  value: "",
  error: false,
  helperText: undefined,
};
