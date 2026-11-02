// index.html içindeki <template id="sayfa"> şablonunu başlangıç durumuyla
// önceden çizer ve sonucu <div id="app"> içine yazar.
// Böylece sayfa JavaScript çalışmadan da görünür, arama motorları ve link
// önizlemeleri içeriği okuyabilir. Tarayıcıda main.js aynı HTML'in üzerine
// oturur ve sepet her zamanki gibi çalışır.
//
// Şablonu (template) veya main.js'i değiştirdikten sonra çalıştır:
//   npm install   (sadece ilk seferde)
//   npm run build
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = __dirname;
const file = path.join(root, 'index.html');
const START = '<div id="app">';
const END = '</div>\n<template id="sayfa">';

let html = fs.readFileSync(file, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END, a);
if (a === -1 || b === -1) throw new Error('index.html içinde #app / #sayfa bulunamadı');

// Önceki çıktıyı temizle, şablondan yeniden çiz
html = html.slice(0, a + START.length) + html.slice(b);

const dom = new JSDOM(html, { pretendToBeVisual: true, runScripts: 'outside-only' });
const w = dom.window;
w.eval(fs.readFileSync(path.join(root, 'assets/dc.js'), 'utf8'));
w.eval(fs.readFileSync(path.join(root, 'assets/main.js'), 'utf8'));

const rendered = w.document.getElementById('app').innerHTML;
if (!rendered.trim()) throw new Error('Çizim boş çıktı');

const out = html.slice(0, a + START.length) + rendered + html.slice(a + START.length);
fs.writeFileSync(file, out);
console.log('index.html güncellendi: #app ' + Math.round(rendered.length / 1024) + ' KB');
w.close();
