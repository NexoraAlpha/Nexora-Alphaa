const CACHE_NAME = "nexora-alpha-sw-v3";

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
    icon: data.icon || "/nexora-icon-192.png",
    badge: data.badge || "/nexora-icon-192.png",
    tag: data.tag || "nexora-notification",
    renotify: true,
    requireInteraction: false,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/?open=notifications",
      notificationId: data.notificationId || data.id || null,
      type: data.type || "notification"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "/?open=notifications";

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      if (!client.url) continue;
      if ("focus" in client) {
        try {
          if (targetUrl.startsWith("/")) await client.navigate(targetUrl);
        } catch (_) {}
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    return undefined;
  })());
});
