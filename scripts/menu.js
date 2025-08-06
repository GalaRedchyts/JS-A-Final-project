"use strict";

async function loadComponent(selector, url) {
    const container = document.querySelector(selector);
    if (!container) {
      console.error(`Selector not found: ${selector}`);
      return;
    }
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(` HTTP ${response.status} when loading ${url}`);
  
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.body;
  
      container.innerHTML = '';
      [...content.children].forEach(child => container.appendChild(child));
    } catch (error) {
      console.error(`Component loading error: ${url}`, error);
    }
  }

  loadComponent('[data-header]', '/components/menu.html');
  
  
