import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;
let bootPromise = null;

// load / create webcontainer instance
export const getWebContainer = async () => {

  // return existing instance
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  // return existing boot promise
  if (bootPromise) {
    return bootPromise;
  }

  // start boot
  bootPromise = WebContainer.boot()
    .then((instance) => {
      webcontainerInstance = instance;
      return instance;
    })
    .catch((err) => {
      // reset if boot failed
      bootPromise = null;
      console.error("WebContainer boot failed:", err);
      throw err;
    });

  return bootPromise;
};

// optional: reset container (if needed)
export const resetWebContainer = () => {
  webcontainerInstance = null;
  bootPromise = null;
};
