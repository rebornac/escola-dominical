"""Gera o sw.js (modo offline). Rode depois de mudar qualquer arquivo da aula:
    python gerar-sw.py
A versão do cache muda sozinha, e quem instalou o app recebe a atualização."""
import os, hashlib

files = ["./", "index.html", "estudo_14_zacarias_apresentacao.html", "manifest.webmanifest"]
for d in ("icones", "fonts", "imagens"):
    for n in sorted(os.listdir(d)):
        if n.startswith(".") or os.path.isdir(os.path.join(d, n)):
            continue
        files.append(f"{d}/{n}")

h = hashlib.sha1()
for p in files[1:]:
    h.update(open(p, "rb").read())
ver = h.hexdigest()[:10]
lst = ",\n  ".join(f"'{p}'" for p in files)

sw = f"""/* Service worker: deixa a aula disponível sem internet.
   Gerado por gerar-sw.py — não edite à mão. */
const VERSAO = 'aula-{ver}';
const ARQUIVOS = [
  {lst}
];

self.addEventListener('install', e => {{
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
}});

self.addEventListener('activate', e => {{
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
}});

self.addEventListener('fetch', e => {{
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Responde do cache (funciona offline); se não tiver, busca na rede e guarda.
  e.respondWith(
    caches.match(req, {{ ignoreSearch: true }}).then(hit => hit || fetch(req).then(res => {{
      if (res.ok) {{ const copy = res.clone(); caches.open(VERSAO).then(c => c.put(req, copy)); }}
      return res;
    }}))
  );
}});
"""
open("sw.js", "w", encoding="utf-8", newline="\n").write(sw)
print(f"sw.js gerado — versão {ver}, {len(files)} arquivos")
