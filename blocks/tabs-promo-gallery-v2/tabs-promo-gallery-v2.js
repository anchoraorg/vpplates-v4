/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Tabs Promo Gallery V2 — carousel with tabbed categories,
 * colored panels, product images, slide animations, and touch support.
 *
 * Authored content per item (4 cells per row):
 *   0: category   — tab label (e.g. "SLIM")
 *   1: panel group — collapsed cell with panel_color, panel_title, panel_text
 *   2: image       — product image (<picture>)
 *   3: description — richtext with description paragraphs + CTA link
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return; // preserve UE container

  /* ── Parse authored items ─────────────────────────────── */
  const items = rows.map((row) => {
    const cells = [...row.children];
    moveInstrumentation(row, row);

    // Cell 1 is the collapsed panel group (panel_color, panel_title, panel_text)
    const panelCell = cells[1];
    const panelParagraphs = panelCell ? [...panelCell.querySelectorAll('p')] : [];

    return {
      category: (cells[0]?.textContent || '').trim(),
      panelColor: (panelParagraphs[0]?.textContent || '#000000').trim(),
      heading: (panelParagraphs[1]?.textContent || '').trim(),
      panelText: (panelParagraphs[2]?.textContent || '').trim(),
      imageEl: cells[2]?.querySelector('picture') || cells[2]?.querySelector('img'),
      contentEl: cells[3],
    };
  });

  const categories = [];
  items.forEach((item) => {
    if (item.category && !categories.includes(item.category)) {
      categories.push(item.category);
    }
  });

  if (categories.length === 0) return;

  /* ── Build DOM ────────────────────────────────────────── */
  block.textContent = '';

  // Desktop tabs
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'tpg2-tabs';
  const tabList = document.createElement('ul');
  tabList.setAttribute('role', 'tablist');

  categories.forEach((cat, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(i === 0));
    btn.dataset.category = cat;
    btn.textContent = cat;
    li.append(btn);
    tabList.append(li);
  });
  tabsWrap.append(tabList);

  // Mobile dropdown
  const mobileWrap = document.createElement('div');
  mobileWrap.className = 'tpg2-mobile-tabs';
  const sel = document.createElement('select');
  sel.setAttribute('aria-label', 'Select category');
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    sel.append(opt);
  });
  mobileWrap.append(sel);

  // Carousel
  const carouselOuter = document.createElement('div');
  carouselOuter.className = 'tpg2-carousel';

  const carouselInner = document.createElement('div');
  carouselInner.className = 'tpg2-carousel-inner';

  const carouselList = document.createElement('ul');
  carouselList.className = 'tpg2-list';

  const slideEls = [];

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'tpg2-item';
    li.dataset.category = item.category;

    // Panel (left side)
    const panel = document.createElement('div');
    panel.className = 'tpg2-panel';
    panel.style.backgroundColor = item.panelColor;

    // Background image overlay (using panel color)
    const bgOverlay = document.createElement('div');
    bgOverlay.className = 'tpg2-panel-bg';
    panel.append(bgOverlay);

    const title = document.createElement('h4');
    title.className = 'tpg2-panel-title';
    title.textContent = item.heading;
    panel.append(title);

    if (item.panelText) {
      const desc = document.createElement('p');
      desc.className = 'tpg2-panel-desc';
      desc.textContent = item.panelText;
      panel.append(desc);
    }

    if (item.imageEl) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'tpg2-panel-img';
      imgWrap.append(item.imageEl.cloneNode(true));
      panel.append(imgWrap);
    }

    // Content (right side)
    const content = document.createElement('div');
    content.className = 'tpg2-content';

    if (item.contentEl) {
      [...item.contentEl.children].forEach((child) => {
        const clone = child.cloneNode(true);
        const link = clone.tagName === 'A' ? clone : clone.querySelector('a');
        if (link) {
          link.className = 'tpg2-cta';
        }
        content.append(clone);
      });
    }

    li.append(panel, content);
    carouselList.append(li);
    slideEls.push(li);
  });

  carouselInner.append(carouselList);

  // Watermark
  const watermark = document.createElement('div');
  watermark.className = 'tpg2-watermark';
  const watermarkSpan = document.createElement('span');
  watermark.append(watermarkSpan);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'tpg2-controls';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'tpg2-prev';
  prevBtn.innerHTML = '&#8249;';
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'tpg2-next';
  nextBtn.innerHTML = '&#8250;';
  nextBtn.setAttribute('aria-label', 'Next');

  controls.append(prevBtn, nextBtn);
  carouselOuter.append(carouselInner, watermark, controls);
  block.append(tabsWrap, mobileWrap, carouselOuter);

  /* ── State & interaction ──────────────────────────────── */
  let activeCat = categories[0];
  let activeIdx = 0;

  function getCatItems() {
    return slideEls.filter((el) => el.dataset.category === activeCat);
  }

  function update(direction) {
    const catItems = getCatItems();

    slideEls.forEach((el) => {
      el.className = 'tpg2-item';
      el.style.display = 'none';
    });

    const current = catItems[activeIdx];
    if (current) {
      current.style.display = '';
      current.classList.add('active');

      if (direction === 'next') current.classList.add('tpg2-slide-in-left');
      else if (direction === 'prev') current.classList.add('tpg2-slide-in-right');
    }

    // Watermark
    watermarkSpan.textContent = activeCat;

    // Tab state
    tabList.querySelectorAll('button').forEach((btn) => {
      btn.setAttribute('aria-selected', String(btn.dataset.category === activeCat));
    });
    sel.value = activeCat;

    // Control state
    prevBtn.disabled = activeIdx === 0;
    nextBtn.disabled = activeIdx >= catItems.length - 1;
  }

  function switchCategory(cat) {
    activeCat = cat;
    activeIdx = 0;
    update();
  }

  // Desktop tab clicks
  tabList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) switchCategory(btn.dataset.category);
  });

  // Mobile select
  sel.addEventListener('change', () => switchCategory(sel.value));

  // Prev / Next
  prevBtn.addEventListener('click', () => {
    if (activeIdx > 0) {
      activeIdx -= 1;
      update('prev');
    }
  });

  nextBtn.addEventListener('click', () => {
    const catItems = getCatItems();
    if (activeIdx < catItems.length - 1) {
      activeIdx += 1;
      update('next');
    }
  });

  // Touch / swipe support
  let touchStartX = 0;
  carouselInner.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselInner.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    const catItems = getCatItems();
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIdx < catItems.length - 1) {
        activeIdx += 1;
        update('next');
      } else if (diff < 0 && activeIdx > 0) {
        activeIdx -= 1;
        update('prev');
      }
    }
  }, { passive: true });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    const catItems = getCatItems();
    if (e.key === 'ArrowLeft' && activeIdx > 0) {
      activeIdx -= 1;
      update('prev');
    } else if (e.key === 'ArrowRight' && activeIdx < catItems.length - 1) {
      activeIdx += 1;
      update('next');
    }
  });

  // Init
  update();
}
