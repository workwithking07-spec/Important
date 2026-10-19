var CACHE="codekothi-v1";
var CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",function(e){
e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){
e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
var r=e.request;if(r.method!=="GET")return;
var u=new URL(r.url);
if(r.mode==="navigate"){
// page: network first (so updates arrive), cached copy when offline
e.respondWith(fetch(r).then(function(res){
if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put("index.html",cp)})}
return res}).catch(function(){
return caches.match("index.html").then(function(m){return m||caches.match("./")})}));
return}
if(u.origin===location.origin||u.hostname==="www.gstatic.com"){
// own files + versioned Firebase scripts: cached copy first, refreshed in background
e.respondWith(caches.match(r).then(function(m){
var net=fetch(r).then(function(res){
if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}
return res}).catch(function(){return m});
return m||net}))}
});
