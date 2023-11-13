"use client";

import { Provider } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { store } from "./store";

function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

ReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ReduxProvider };
