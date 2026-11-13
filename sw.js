/* Service worker: deixa a aula disponível sem internet.
   Gerado por gerar-sw.py — não edite à mão. */
const VERSAO = 'aula-35c7d0ef0e';
const ARQUIVOS = [
  './',
  'index.html',
  'estudo_14_zacarias_apresentacao.html',
  'manifest.webmanifest',
  'icones/icone-192.png',
  'icones/icone-512.png',
  'fonts/cormorant-garamond-italic.woff2',
  'fonts/cormorant-garamond.woff2',
  'fonts/source-sans-3.woff2',
  'imagens/abertura.jpg',
  'imagens/alivio-comico.jpg',
  'imagens/crise-colheitas.jpg',
  'imagens/crise-devastado.jpg',
  'imagens/crise-divisoes.jpg',
  'imagens/crise-impaciencia.jpg',
  'imagens/crise-moral.jpg',
  'imagens/esperanca.jpg',
  'imagens/jerusalem-restaurada.jpg',
  'imagens/mensagem.jpg',
  'imagens/pais-cansado.jpg',
  'imagens/profeta-visao.jpg',
  'imagens/templo-515.jpg',
  'imagens/visao-1.jpg',
  'imagens/visao-2.jpg',
  'imagens/visao-3.jpg',
  'imagens/visao-4.jpg',
  'imagens/visao-5.jpg',
  'imagens/visao-6-7.jpg',
  'imagens/visao-8.jpg',
  'imagens/zacarias.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Responde do cache (funciona offline); se não tiver, busca na rede e guarda.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSAO).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
