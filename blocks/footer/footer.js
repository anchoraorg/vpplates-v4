import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Assign classes to footer sections
  const sections = footer.querySelectorAll('.section');
  const classes = ['footer-nav', 'footer-social', 'footer-partners', 'footer-legal'];
  sections.forEach((section, i) => {
    if (classes[i]) section.classList.add(classes[i]);
  });

  // Remove button classes from all footer links
  footer.querySelectorAll('.button').forEach((btn) => {
    btn.className = '';
    const container = btn.closest('.button-container');
    if (container) container.className = '';
  });

  // Add arrow icons to nav links
  const navSection = footer.querySelector('.footer-nav');
  if (navSection) {
    navSection.querySelectorAll('li a').forEach((link) => {
      const arrow = document.createElement('span');
      arrow.className = 'footer-nav-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      link.append(arrow);
    });
  }

  block.append(footer);
}
