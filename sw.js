// Service Worker para cache do Sistema AdOps
const CACHE_NAME = 'adops-system-v1.0.0';
const CACHE_ASSETS = [
    './',
    './index.html',
    './utils/config.js',
    './components/icons.js',
    './components/AdOpsApp.js',
    './services/sheetsService.js',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com'
];

// Install - Cache dos recursos
self.addEventListener('install', (e) => {
    console.log('🔧 Service Worker: Instalando...');
    
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Cachando arquivos...');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Instalado com sucesso');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('❌ Service Worker: Erro na instalação', err);
            })
    );
});

// Activate - Limpeza de cache antigo
self.addEventListener('activate', (e) => {
    console.log('🚀 Service Worker: Ativando...');
    
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Removendo cache antigo', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Ativado com sucesso');
            return self.clients.claim();
        })
    );
});

// Fetch - Estratégia de cache
self.addEventListener('fetch', (e) => {
    const request = e.request;
    const url = new URL(request.url);
    
    // Ignore non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignore Google Apps Script requests (sempre da rede)
    if (url.hostname === 'script.google.com') {
        return;
    }
    
    // Ignore external scripts on first load
    if (url.hostname !== location.hostname && !CACHE_ASSETS.includes(request.url)) {
        return;
    }
    
    e.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Se tem no cache, retorna do cache
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Se não tem no cache, busca da rede
                return fetch(request)
                    .then(networkResponse => {
                        // Se a resposta é válida, adiciona ao cache
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(err => {
                        console.log('🌐 Service Worker: Falha na rede para', request.url);
                        
                        // Se é uma página HTML, retorna página offline
                        if (request.headers.get('accept').includes('text/html')) {
                            return new Response(`
                                <!DOCTYPE html>
                                <html lang="pt-BR">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Sistema AdOps - Offline</title>
                                    <style>
                                        body {
                                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            min-height: 100vh;
                                            margin: 0;
                                            background: #f3f4f6;
                                            color: #374151;
                                        }
                                        .offline-container {
                                            text-align: center;
                                            padding: 2rem;
                                            background: white;
                                            border-radius: 0.5rem;
                                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                        }
                                        .offline-icon {
                                            font-size: 4rem;
                                            margin-bottom: 1rem;
                                        }
                                        button {
                                            background: #3b82f6;
                                            color: white;
                                            border: none;
                                            padding: 0.75rem 1.5rem;
                                            border-radius: 0.375rem;
                                            cursor: pointer;
                                            margin-top: 1rem;
                                        }
                                        button:hover {
                                            background: #2563eb;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-container">
                                        <div class="offline-icon">📡</div>
                                        <h1>Sistema AdOps</h1>
                                        <h2>Modo Offline</h2>
                                        <p>Você está sem conexão com a internet.</p>
                                        <p>O sistema funcionará com os dados salvos localmente.</p>
                                        <button onclick="window.location.reload()">
                                            Tentar Novamente
                                        </button>
                                    </div>
                                </body>
                                </html>
                            `, {
                                headers: { 'Content-Type': 'text/html' }
                            });
                        }
                        
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Handle messages from main thread
self.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (e.data && e.data.type === 'GET_VERSION') {
        e.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Background sync para operações pendentes
self.addEventListener('sync', (e) => {
    if (e.tag === 'background-sync') {
        console.log('🔄 Service Worker: Background sync triggered');
        e.waitUntil(doBackgroundSync());
    }
});

// Função para sincronização em background
async function doBackgroundSync() {
    try {
        // Verificar se há operações pendentes no localStorage
        const pendingOps = localStorage.getItem('pendingOperations');
        if (pendingOps) {
            const operations = JSON.parse(pendingOps);
            console.log('📝 Service Worker: Processando', operations.length, 'operações pendentes');
            
            // Aqui você pode implementar lógica específica
            // para processar operações pendentes
        }
    } catch (error) {
        console.error('❌ Service Worker: Erro na sincronização', error);
    }
}

// Push notifications (futuro)
self.addEventListener('push', (e) => {
    if (e.data) {
        const data = e.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192.png',
            badge: '/icon-72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 1
            }
        };
        
        e.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

console.log('🚀 Service Worker carregado:', CACHE_NAME);