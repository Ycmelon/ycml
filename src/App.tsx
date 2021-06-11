import React, { useMemo } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { AliasRedirect, Create } from "./routes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Main = () => {
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
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={Create} />
          <Route path="/:alias" component={AliasRedirect} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Main;
