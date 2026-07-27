import { memo } from "react";

const BackgroundBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Indigo Ambient Flare */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px]" />

      {/* Bottom Right Violet Ambient Flare */}
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-gradient-to-tl from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px]" />
    </div>
  );
};

export default memo(BackgroundBlobs);
