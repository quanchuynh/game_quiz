import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

import App from "../imports/ui/App.js";

Meteor.startup(() => {
  /* Render react App into react-app element */
  ReactDOM.render(<App quizId="5011" />, document.getElementById("react-app"));
});
