const BackgroundBlobs = () => {
  return (
    <>
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[300px] md:w-[500px]  h-[300px] md:h-[500px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="absolute bottom-0 right-0 w-[300px] md:w-[400px] h-[300px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
    </>
  );
};

export default BackgroundBlobs;
