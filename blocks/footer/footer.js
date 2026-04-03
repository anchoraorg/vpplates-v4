import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '/icons/facebook.svg',
  instagram: '/icons/instagram.svg',
  youtube: '/icons/youtube.svg',
};

const PARTNER_LOGOS = {
  vicroads: '/icons/vicroads.svg',
  'vic.gov': '/icons/vic-gov.svg',
};

function detectSocialPlatform(href) {
  if (href.includes('facebook.com')) return 'facebook';
  if (href.includes('instagram.com')) return 'instagram';
  if (href.includes('youtube.com')) return 'youtube';
  return null;
}

function detectPartner(href) {
  if (href.includes('vicroads')) return 'vicroads';
  if (href.includes('vic.gov')) return 'vic.gov';
  return null;
}

function decorateSocialLinks(section) {
  section.querySelectorAll('a').forEach((link) => {
    const platform = detectSocialPlatform(link.href);
    if (platform && SOCIAL_ICONS[platform]) {
      const label = link.textContent.trim();
      const img = document.createElement('img');
      img.src = SOCIAL_ICONS[platform];
      img.alt = label;
      img.classList.add('footer-social-img');
      link.textContent = '';
      link.append(img);
      link.setAttribute('aria-label', label);
      link.classList.add('footer-social-icon');
    }
  });
}

function decoratePartnerLinks(section) {
  section.querySelectorAll('a').forEach((link) => {
    const partner = detectPartner(link.href);
    if (partner && PARTNER_LOGOS[partner]) {
      const label = link.textContent.trim();
      const img = document.createElement('img');
      img.src = PARTNER_LOGOS[partner];
      img.alt = label;
      img.classList.add('footer-partner-img');
      link.textContent = '';
      link.append(img);
      link.setAttribute('aria-label', label);
    }
    link.classList.add('footer-partner-link');
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

  // Assign classes to footer sections
  const sections = footer.querySelectorAll('.section');
  if (sections.length >= 4) {
    sections[0].classList.add('footer-nav');
    sections[1].classList.add('footer-social');
    sections[2].classList.add('footer-partners');
    sections[3].classList.add('footer-legal');
    decorateSocialLinks(sections[1]);
    decoratePartnerLinks(sections[2]);
  } else if (sections.length === 3) {
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
