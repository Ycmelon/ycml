import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";

import firebase_ from "firebase/app";
import "firebase/firestore";

type Params = {
  alias: string;
};

const AliasRedirect = ({ match }: RouteComponentProps<Params>) => {
  const firebase = firebase_.apps[0];
  const db = firebase.firestore();
  const alias = match.params.alias;

  const [status, setStatus] =
    useState<"loading" | "invalid" | "success">("loading");

  const get = async () => {
    const query = await db.collection("urls").where("alias", "==", alias).get();
    if (query.empty) {
      setStatus("invalid");
    } else {
      window.location = query.docs[0].data().url;
      setStatus("success");
    }
  };

  get();

  if (status === "invalid") {
    return <p>Invalid URL!</p>;
  }
  return <p>Redirecting...</p>;
};

export default AliasRedirect;
