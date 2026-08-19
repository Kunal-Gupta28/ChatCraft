/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
let coepCredentialless = !1;
if ("undefined" == typeof window) {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener("message", (e) => {
    if (e.data) {
      if ("deregister" === e.data.type) {
        self.registration
          .unregister()
          .then(() => self.clients.matchAll())
          .then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
          });
      } else if ("coepCredentialless" === e.data.type) {
        coepCredentialless = e.data.value;
      }
    }
  });
  self.addEventListener("fetch", function (e) {
    const r = e.request;
    if ("only-if-cached" === r.cache && "same-origin" !== r.mode) return;
    const s =
      coepCredentialless && "no-cors" === r.mode
        ? new Request(r, { credentials: "omit" })
        : r;
    e.respondWith(
      fetch(s)
        .then((resp) => {
          if (0 === resp.status) return resp;
          const headers = new Headers(resp.headers);
          headers.set(
            "Cross-Origin-Embedder-Policy",
            coepCredentialless ? "credentialless" : "require-corp"
          );
          if (!coepCredentialless) {
            headers.set("Cross-Origin-Resource-Policy", "cross-origin");
          }
          headers.set("Cross-Origin-Opener-Policy", "same-origin");
          return new Response(resp.body, {
            status: resp.status,
            statusText: resp.statusText,
            headers: headers,
          });
        })
        .catch((err) => console.error(err))
    );
  });
} else {
  (() => {
    const e = {
      shouldRegister: () => !0,
      shouldDeregister: () => !1,
      coepCredentialless: () => !(window.chrome || window.netscape),
      doReload: () => window.location.reload(),
      quiet: !1,
      ...window.coi,
    };
    const r = navigator;
    if (r.serviceWorker && r.serviceWorker.controller) {
      r.serviceWorker.controller.postMessage({
        type: "coepCredentialless",
        value: e.coepCredentialless(),
      });
      if (e.shouldDeregister()) {
        r.serviceWorker.controller.postMessage({ type: "deregister" });
      }
    }
    if (!1 === window.crossOriginIsolated && e.shouldRegister()) {
      if (window.isSecureContext) {
        if (r.serviceWorker) {
          r.serviceWorker.register(window.document.currentScript.src).then(
            (s) => {
              if (!e.quiet) console.log("COOP/COEP Service Worker registered", s.scope);
              s.addEventListener("updatefound", () => {
                if (!e.quiet)
                  console.log(
                    "Reloading page to make use of updated COOP/COEP Service Worker."
                  );
                e.doReload();
              });
              if (s.active && !r.serviceWorker.controller) {
                if (!e.quiet)
                  console.log(
                    "Reloading page to make use of COOP/COEP Service Worker."
                  );
                e.doReload();
              }
            },
            (err) => {
              if (!e.quiet)
                console.error("COOP/COEP Service Worker failed to register:", err);
            }
          );
        }
      } else if (!e.quiet) {
        console.log(
          "COOP/COEP Service Worker not registered, a secure context is required."
        );
      }
    }
  })();
}
