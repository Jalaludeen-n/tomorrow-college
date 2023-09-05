import React from "react";

class IframeButton extends React.Component {
  openIframeInNewPage = (iframeURL) => {
    window.open(iframeURL, "_blank", "fullscreen=yes");
  };

  render() {
    const { iframeURL } = this.props;
    return (
      <button onClick={() => this.openIframeInNewPage(iframeURL)}>
        Open Chart
      </button>
    );
  }
}

export default IframeButton;
