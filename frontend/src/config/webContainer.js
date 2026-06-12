import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;
let bootPromise = null;
let teardownTimer = null;

// load / create webcontainer instance
export const getWebContainer = async () => {
  if (teardownTimer) {
    clearTimeout(teardownTimer);
    teardownTimer = null;
  }

  // return existing instance
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  // return existing boot promise
  if (bootPromise) {
    return bootPromise;
  }
console.log("Boot start ho raha hai...");
  // start boot
  bootPromise = WebContainer.boot()
    .then((instance) => {
      console.log("Boot successful");
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

export const teardownWebContainer = (instance) => {
  if (!instance || instance !== webcontainerInstance) return;

  teardownTimer = setTimeout(() => {
    try {
      instance.teardown();
    } finally {
      resetWebContainer();
      teardownTimer = null;
    }
  }, 0);
};
