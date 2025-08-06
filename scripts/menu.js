"use strict";

document.addEventListener('DOMContentLoaded', () => {
  fetch('../components/menu.html')
    .then(res => res.text())
    .then(data => {
      const parser = new DOMParser();
      const nav = parser.parseFromString(data, 'text/html').querySelector('nav');
      document.querySelector('[data-header]').appendChild(nav);
    });
});
