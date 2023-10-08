const generateServiceWorker = () => {
    return {
        name: 'generate-service-worker',
        generateBundle(_options: any, bundle: any) {
            const assets: string[] = []

            for (const fileName in bundle) {
                if (bundle[fileName].type === 'asset' || bundle[fileName].type === 'chunk') {
                    assets.push(`'${fileName}'`)
                }
            }

            const swContent = `
              const name = 'Monogatari';
              const version = '0.1.0';
              const files = [${assets.join(', ')}];

              self.addEventListener('install', (event) => {
                  self.skipWaiting();
                  event.waitUntil(
                      caches.open(\`\${name}-v\${version}\`).then((cache) => {
                          return cache.addAll(files);
                      })
                  );
              });

              self.addEventListener('activate', (event) => {
                  event.waitUntil(
                      caches.keys().then((keyList) => {
                          return Promise.all(keyList.map((key) => {
                              if (key !== \`\${name}-v\${version}\`) {
                                  return caches.delete(key);
                              }
                          }));
                      })
                  );
                  return self.clients.claim();
              });

              self.addEventListener('fetch', (event) => {
                  if (event.request.method !== 'GET') {
                      return;
                  }
                  event.respondWith(
                      caches.match(event.request).then((cached) => {
                          function fetchedFromNetwork(response) {
                              const cacheCopy = response.clone();
                              caches.open(\`\${name}-v\${version}\`).then(function add(cache) {
                                  cache.put(event.request, cacheCopy);
                              });
                              return response;
                          }
                          function unableToResolve() {
                              return new Response(
                                  \`<!DOCTYPE html><html lang=en><title>Bad Request</title><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><style>body,html{width:100%;height:100%}body{text-align:center;color:#545454;margin:0;display:flex;justify-content:center;align-items:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Fira Sans","Droid Sans","Helvetica Neue",sans-serif}h1,h2{font-weight:lighter}h1{font-size:4em}h2{font-size:2em}</style><div><h1>Service Unavailable</h1><h2>Sorry, the server is currently unavailable or under maintenance, try again later.</h2></div>\`,
                                  {
                                      status: 503,
                                      statusText: 'Service Unavailable',
                                      headers: new Headers({
                                          'Content-Type': 'text/html'
                                      })
                                  }
                              );
                          }
                          const networked = fetch(event.request)
                              .then(fetchedFromNetwork, unableToResolve)
                              .catch(unableToResolve);
                          return cached || networked;
                      })
                  );
              });
          `
            const swAsset: any = {
                type: 'asset',
                fileName: 'service-worker.js',
                source: swContent
            }
            ;(this as any).emitFile(swAsset)
        }
    }
}

export default generateServiceWorker
