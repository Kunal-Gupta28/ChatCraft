import { memo } from "react";

const PreviewPane = ({ iframeUrl }) => {

  // if iframe Url is not present then show waiting for server...
  if (!iframeUrl)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Waiting for server…
      </div>
    );

  return (

    //  if iframe url display it 
    <iframe
      key={iframeUrl}
      src={iframeUrl}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0"
      title="Project Preview"
      loading="lazy"
    />
  );
};

export default memo(PreviewPane);