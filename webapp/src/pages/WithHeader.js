import React from "react";
import AppHeader from "../components/AppHeader";

const WithHeader = (WrappedComponent) => {
  return (props) => {
    return (
      <div>
        <AppHeader />
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default WithHeader;
