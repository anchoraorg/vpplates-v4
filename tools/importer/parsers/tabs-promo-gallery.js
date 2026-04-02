/* eslint-disable */
/* global WebImporter */
/**
 * tabs-promo-gallery parser (deduplicated). Base: tabs. vplates
 * Container block - model fields per item: title (text, skip-collapsed), content_heading (text),
 * content_headingType (select, skip-collapsed), content_image (ref), content_richtext (richtext)
 * Tabs block: 2 cols per row: [tab-label | tab-content] per tab
 */
export default function parse(element, { document }) {
  // Find tab buttons for labels
  const tabButtons = element.querySelectorAll('.promo-gallery__tab-nav-btn');
  // Find tab content panels
  const tabPanels = element.querySelectorAll('.promo-tabs__promo-item');

  const cells = [];

  tabButtons.forEach((btn, i) => {
    const tabLabel = btn.textContent.trim();
    const panel = tabPanels[i];

    // Col 1: tab title
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:title '));
    titleCell.appendChild(document.createTextNode(tabLabel));

    // Col 2: tab content (heading + image + richtext from carousel items)
    const contentCell = document.createDocumentFragment();

    if (panel) {
      const carouselTitle = panel.querySelector('.promo-carousel__title, h3');
      // Select only direct li.carousel-item children (avoid duplicates from hidden/active variants)
      const carouselList = panel.querySelector('.promo-carousel__list');
      const carouselItems = carouselList
        ? carouselList.querySelectorAll(':scope > li.carousel-item')
        : panel.querySelectorAll('li.carousel-item');

      // Deduplicate by title text (source has active + hidden + dummy copies)
      const seenTitles = new Set();
      const uniqueItems = [...carouselItems].filter((item) => {
        const t = item.querySelector('.carousel-item__panel-title, h4');
        const key = t ? t.textContent.trim() : '';
        if (!key || seenTitles.has(key)) return false;
        seenTitles.add(key);
        return true;
      });

      // Heading
      if (carouselTitle) {
        contentCell.appendChild(document.createComment(' field:content_heading '));
        const h3 = document.createElement('h3');
        h3.textContent = carouselTitle.textContent.trim();
        contentCell.appendChild(h3);
      }

      // First unique carousel item image
      const firstItem = uniqueItems[0] || panel;
      const img = firstItem.querySelector('.carousel-item__panel-background-image, .carousel-item__panel-image, img');
      if (img) {
        contentCell.appendChild(document.createComment(' field:content_image '));
        const pic = document.createElement('picture');
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('data-src') || '';
        imgEl.alt = img.alt || tabLabel;
        pic.appendChild(imgEl);
        contentCell.appendChild(pic);
      }

      // Richtext: product descriptions and CTAs from unique carousel items only
      contentCell.appendChild(document.createComment(' field:content_richtext '));
      uniqueItems.forEach((item) => {
        const title = item.querySelector('.carousel-item__panel-title, h4');
        const text = item.querySelector('.carousel-item__content-text p');
        const cta = item.querySelector('.carousel-item__content-cta');

        if (title) {
          const h4 = document.createElement('h4');
          h4.textContent = title.textContent.trim();
          contentCell.appendChild(h4);
        }
        if (text) {
          const p = document.createElement('p');
          p.textContent = text.textContent.trim();
          contentCell.appendChild(p);
        }
        if (cta) {
          const a = document.createElement('a');
          a.href = cta.href || '#';
          a.textContent = cta.textContent.trim() || 'Learn more';
          contentCell.appendChild(a);
        }
      });
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-promo-gallery', cells });
  element.replaceWith(block);
}
