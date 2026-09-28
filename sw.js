/* Cất sẵn game trong máy để mở được cả khi mất mạng */
const CACHE="quan-tra-may-v2";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  /* có mạng: lấy bản mới nhất và cất lại; mất mạng: dùng bản đã cất */
  e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{})}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(e.request.mode==="navigate"?caches.match("./index.html"):Response.error()))));
});
