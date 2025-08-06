"use strict";

async function loadComponent(selector, relativePathFromRoot) {
    const container = document.querySelector(selector);
    if (!container) {
      console.error(`Selector not found: ${selector}`);
      return;
    }
  
    const currentUrl = location.origin + location.pathname;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    const fullUrl = `${baseUrl}${relativePathFromRoot.startsWith('/') ? '' : '/'}${relativePathFromRoot}`;
  
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`❌ HTTP ${response.status} while fetching ${fullUrl}`);
  
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.body;
  
      container.innerHTML = '';
      [...content.children].forEach(child => container.appendChild(child));
    } catch (error) {
      console.error(`Failed to load component from ${fullUrl}`, error);
    }
  }

  loadComponent('[data-header]', '/components/menu.html');
  
  
