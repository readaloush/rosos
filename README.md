# rosos

Öğrenciler, freelancer'lar ve küçük işletmeler için web sitesi hizmeti.

## Yapı

- `index.html` — ana sayfa. Sayfanın kaynağı `<template id="sayfa">` içindedir; `<div id="app">` ise bu şablonun önceden çizilmiş halidir (JS kapalıyken ve arama motorları için).
- `assets/main.js` — fiyatlar, sepet ve WhatsApp sipariş mesajı.
- `assets/dc.js` — şablonu çizen küçük motor.
- `demolar/`, `ornekler/`, `cv/` — canlı önizleme sayfaları.

## Değişiklik yaptıktan sonra

`index.html` içindeki şablonu ya da `assets/main.js`'i (örneğin bir fiyatı) değiştirdiysen, önceden çizilmiş kısmı yenile:

```
npm install     # sadece ilk seferde
npm run build
```

Bunu unutursan site yine çalışır (JS açılınca güncel hali gelir), ama JS'siz görünen ve Google'ın okuduğu kısım eski kalır.

## Paylaşım görseli

`og:image` ve `og:url`, `https://readaloush.github.io/rosos/` adresine göre yazıldı. Kendi alan adına geçersen `index.html`'in başındaki bu iki satırı güncelle.
