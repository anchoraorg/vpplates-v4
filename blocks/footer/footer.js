import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
};

function detectSocialPlatform(href) {
  if (href.includes('facebook.com')) return 'facebook';
  if (href.includes('instagram.com')) return 'instagram';
  if (href.includes('youtube.com')) return 'youtube';
  return null;
}

function decorateSocialLinks(section) {
  section.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const platform = detectSocialPlatform(link.href);
    if (platform && SOCIAL_ICONS[platform]) {
      const label = link.textContent.trim();
      link.innerHTML = SOCIAL_ICONS[platform];
      link.setAttribute('aria-label', label);
      link.classList.add('footer-social-icon');
    }
  });
}

function decoratePartnerLinks(section) {
  section.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (link) link.classList.add('footer-partner-link');
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Assign classes to footer sections (3 sections: nav+social+partners | legal | or 4 sections)
  const sections = footer.querySelectorAll('.section');
  if (sections.length >= 4) {
    // 4 sections: nav, social, partners, legal
    sections[0].classList.add('footer-nav');
    sections[1].classList.add('footer-social');
    sections[2].classList.add('footer-partners');
    sections[3].classList.add('footer-legal');
    decorateSocialLinks(sections[1]);
    decoratePartnerLinks(sections[2]);
  } else if (sections.length === 3) {
    // 3 sections: nav, social+partners, legal
    sections[0].classList.add('footer-nav');
    sections[1].classList.add('footer-social');
    sections[2].classList.add('footer-legal');
    decorateSocialLinks(sections[1]);
  } else if (sections.length === 2) {
    sections[0].classList.add('footer-nav');
    sections[1].classList.add('footer-legal');
  }

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
