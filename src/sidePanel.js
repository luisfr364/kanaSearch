function createSidePanel(url) {
  return `
  <div id="my-side-panel"style="width: 25%; position: fixed; height: 100%; right: 0; top: 0; z-index: 100; overflow: hidden; border-bottom-left-radius: 12px; border-top-left-radius: 12px;">
    <iframe src="${url}" style="height: 100%; width: 100%;" />
  </div>
`;
}

export default createSidePanel;
