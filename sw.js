const CACHE_NAME = "nexora-alpha-sw-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "NEXORA ALPHA";
  const options = {
    body: data.body || "Ada notifikasi baru di Nexora Alpha.",
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/favicon.ico",
    tag: data.tag || "nexora-notification",
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || "/",
      notificationId: data.notificationId || data.id || null
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          try {
            if (targetUrl.startsWith("/")) {
              client.navigate(targetUrl);
            }
          } catch (_) {}
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});
