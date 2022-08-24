import React from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import TabMemo from "./TabMemo";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.render(
  <React.StrictMode>
    <TabMemo />
  </React.StrictMode>,
  root
);
