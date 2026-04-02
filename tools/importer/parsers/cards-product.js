/* eslint-disable */
/* global WebImporter */
/**
 * cards-product. Base: cards. vplates homepage
 * Container block - model fields per item: image (ref), text (richtext)
 * Cards block: 2 cols per row: [image | text] per card
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.carousel-item, [class*="carousel-item"]');
  const cells = [];

  items.forEach((item) => {
    const panelImg = item.querySelector('.carousel-item__panel-foreground img, .carousel-item__panel-image, img');
    const bgImg = item.querySelector('.carousel-item__panel-background-image');
    const title = item.querySelector('.carousel-item__panel-title, h4');
    const text = item.querySelector('.carousel-item__panel-text, .carousel-item__content-text p');
    const cta = item.querySelector('.carousel-item__content-cta, a[class*="cta"]');

    // Col 1: product image
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    const img = panelImg || bgImg;
    if (img) {
      const pic = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('data-src') || '';
      imgEl.alt = img.alt || (title ? title.textContent.trim() : '');
      pic.appendChild(imgEl);
      imageCell.appendChild(pic);
    }

    // Col 2: text content
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent.trim();
      textCell.appendChild(h4);
    }
    if (text) {
      const p = document.createElement('p');
      p.textContent = text.textContent.trim();
      textCell.appendChild(p);
    }
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent.trim() || 'Learn more';
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
