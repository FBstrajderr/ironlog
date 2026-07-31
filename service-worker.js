const CACHE_NAME = "ironlog-cache-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./icon-180.png",
];

const MESSAGES_BY_GENDER = {
  male: [
    "Idi u teretanu svinjce, grok grok",
    "You fat as fuck boiiiiii",
    "Gradjen si kao slina"
  ],
  female: [
    "Idi u teretanu svinjce, grok grok",
    "You fat as fuck boiiiiii",
    "Gradjena si kao slina"
  ]
};
function messagesForGender(g) {
  if (g === "male" || g === "female") return MESSAGES_BY_GENDER[g];
  return MESSAGES_BY_GENDER.male.concat(MESSAGES_BY_GENDER.female);
}

const CONFIG_URL = "./ironlog-reminder-config";
let CONFIG = { enabled: false, gender: "" };

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for the app itself, so updates arrive without bumping versions.
// { cache: "no-store" } is the important part -- it skips the browser's own
// HTTP cache (which GitHub Pages sets headers for) and forces an actual
// network round trip, otherwise "network first" can still hand back a stale
// copy the browser already had cached at the HTTP layer.
// Cache first for icons and manifest, which rarely change.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isAppShell = req.mode === "navigate" || req.destination === "document" ||
    req.url.indexOf("index.html") !== -1;

  if (isAppShell) {
    event.respondWith(
      fetch(req, { cache: "no-store" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit);
    })
  );
});

// The page sends reminder settings here so background events can use them.
self.addEventListener("message", (event) => {
  const d = event.data;
  if (!d || d.type !== "ironlog-config") return;
  CONFIG = {
    enabled: !!d.enabled,
    gender: d.gender === "male" || d.gender === "female" ? d.gender : ""
  };
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) =>
      c.put(CONFIG_URL, new Response(JSON.stringify(CONFIG), {
        headers: { "Content-Type": "application/json" },
      }))
    )
  );
});

async function loadConfig() {
  try {
    const c = await caches.open(CACHE_NAME);
    const hit = await c.match(CONFIG_URL);
    if (hit) return await hit.json();
  } catch (e) {}
  return CONFIG;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Fires only where the browser supports it, and only when the browser feels like it.
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "ironlog-daily") return;
  event.waitUntil((async () => {
    const cfg = await loadConfig();
    if (!cfg.enabled) return;
    await self.registration.showNotification("IronLog", {
      body: pick(messagesForGender(cfg.gender)),
      icon: "icon-192.png",
      badge: "icon-192.png",
      tag: "ironlog-daily",
      renotify: true,
    });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});
