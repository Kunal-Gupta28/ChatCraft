import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;
let bootPromise = null;

export const getWebContainer = async () => {

  // if already created, just return it
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  // if already booting, wait for it to finish
  if (bootPromise) {
    return bootPromise;
  }

  // otherwise, start booting
  bootPromise = WebContainer.boot().then((instance) => {
    webcontainerInstance = instance;
    return instance;
  });

  return bootPromise;
};
