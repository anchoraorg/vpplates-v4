// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabBlockCnt = 0;

function buildCarousel(cell) {
  const children = [...cell.children];
  const slides = [];
  let current = null;

  children.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h3' || tag === 'h4') {
      if (current) slides.push(current);
      current = { heading: el, items: [] };
    } else if (current) {
      current.items.push(el);
    }
  });
  if (current) slides.push(current);
  if (slides.length === 0) return;

  cell.innerHTML = '';
  cell.className = 'tabs-promo-gallery-carousel';

  const track = document.createElement('div');
  track.className = 'tabs-promo-gallery-track';

  slides.forEach((slide, i) => {
    const card = document.createElement('div');
    card.className = 'tabs-promo-gallery-card';
    if (i === 0) card.classList.add('active');

    const panel = document.createElement('div');
    panel.className = 'tabs-promo-gallery-card-panel';

    const h4 = document.createElement('h4');
    h4.textContent = slide.heading.textContent;
    panel.append(h4);

    const descP = slide.items.find((el) => el.tagName === 'P' && !el.querySelector('a') && !el.querySelector('picture'));
    if (descP) {
      const desc = document.createElement('p');
      desc.textContent = descP.textContent;
      panel.append(desc);
    }

    const picP = slide.items.find((el) => el.querySelector('picture') || el.querySelector('img'));
    if (picP) {
      const pic = picP.querySelector('picture') || picP;
      panel.append(pic.cloneNode(true));
    }

    const content = document.createElement('div');
    content.className = 'tabs-promo-gallery-card-content';

    slide.items.forEach((el) => {
      if (el.tagName === 'P' && !el.querySelector('picture') && !el.querySelector('img')) {
        const linkInP = el.querySelector('a');
        if (linkInP) {
          const cta = document.createElement('a');
          cta.href = linkInP.href;
          cta.className = 'tabs-promo-gallery-cta';
          cta.textContent = linkInP.textContent;
          content.append(cta);
        } else if (el !== descP) {
          const p = document.createElement('p');
          p.textContent = el.textContent;
          content.append(p);
        }
      }
    });

    card.append(panel, content);
    track.append(card);
  });

  cell.append(track);

  if (slides.length > 1) {
    const controls = document.createElement('div');
    controls.className = 'tabs-promo-gallery-controls';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'tabs-promo-gallery-prev';
    prev.innerHTML = '&#8592;';
    prev.setAttribute('aria-label', 'Previous item');

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'tabs-promo-gallery-next';
    next.innerHTML = '&#8594;';
    next.setAttribute('aria-label', 'Next item');

    let activeIndex = 0;
    const cards = track.querySelectorAll('.tabs-promo-gallery-card');

    const showSlide = (idx) => {
      cards.forEach((c, j) => c.classList.toggle('active', j === idx));
      activeIndex = idx;
      prev.disabled = idx === 0;
      next.disabled = idx === cards.length - 1;
    };

    prev.addEventListener('click', () => { if (activeIndex > 0) showSlide(activeIndex - 1); });
    next.addEventListener('click', () => { if (activeIndex < cards.length - 1) showSlide(activeIndex + 1); });

    showSlide(0);
    controls.append(prev, next);
    cell.append(controls);
  }
}

export default async function decorate(block) {
  const rows = [...block.children].filter(
    (child) => child.firstElementChild && child.firstElementChild.textContent.trim(),
  );

  if (rows.length === 0) return;

  tabBlockCnt += 1;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-promo-gallery-list';
  tablist.setAttribute('role', 'tablist');

  rows.forEach((row, i) => {
    const id = `tpg-${tabBlockCnt}-${i}`;
    const tabHeading = row.firstElementChild;
    const tabLabel = tabHeading ? tabHeading.textContent.trim() : `Tab ${i + 1}`;

    row.className = 'tabs-promo-gallery-panel';
    row.id = id;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-promo-gallery-tab';
    button.id = `tab-${id}`;
    button.textContent = tabLabel;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', false));
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);

    if (tabHeading) tabHeading.classList.add('tabs-promo-gallery-label');

    const contentCell = row.children[1] || row.lastElementChild;
    if (contentCell && contentCell !== tabHeading) {
      buildCarousel(contentCell);
    }

    const headingEl = tabHeading ? tabHeading.querySelector('h1, h2, h3, h4, h5, h6') : null;
    if (headingEl) moveInstrumentation(headingEl, null);
  });

  block.prepend(tablist);
}
