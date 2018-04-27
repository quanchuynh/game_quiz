import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

import App from "../imports/ui/App.js";
import Quiz from "../imports/ui/containers/Quiz.js";

Meteor.startup(() => {
  /* Render react App into react-app element */
  ReactDOM.render(<App quizId="4934" />, document.getElementById("react-app"));
  // ReactDOM.render(<Quiz quizId="4934" />, document.getElementById("react-app"));
});
