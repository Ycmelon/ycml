import React, { useState, useMemo, useEffect } from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import { RouteComponentProps } from "react-router-dom";

import firebase_ from "firebase/app";
import "firebase/firestore";

type Params = {
  alias: string;
};

type Status = "loading" | "invalid" | "success";

const AliasRedirect = ({ match }: RouteComponentProps<Params>) => {
  const db = useMemo(() => {
    const firebase = firebase_.apps[0];
    return firebase.firestore();
  }, []);

  const [status, setStatus] = useState<Status>("loading");

  const alias = match.params.alias;
  useEffect(() => {
    async function get(alias: string): Promise<void> {
      const query = await db
        .collection("urls")
        .where("alias", "==", alias)
        .get();
      if (query.empty) {
        setStatus("invalid");
      } else {
        window.location = query.docs[0].data().url;
        setStatus("success");
      }
    }
    get(alias);
  }, [alias, db]);

  return (
    <div className="center">
      {status === "invalid" ? (
        <div className="container">
          <Typography variant="h4" component="h1" gutterBottom>
            Invalid URL!
          </Typography>
          <Button variant="contained" color="primary" href="/">
            Create one
          </Button>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default AliasRedirect;
