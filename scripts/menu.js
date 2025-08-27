"use strict";

async function loadComponent(selector, relativePath) {
  const container = document.querySelector(selector);
  if (!container) return console.error(`Selector not found: ${selector}`);

  try {
    const response = await fetch(relativePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    container.innerHTML = await response.text();
  } catch (err) {
    console.error(`Failed to load ${relativePath}`, err);
  }
}

loadComponent('[data-header]', '/components/menu.html');

  
  
