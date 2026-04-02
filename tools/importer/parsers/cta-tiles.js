/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cta-tiles. Base: cards. vplates.com.au
 * Container block - model fields per item: image (ref), text (richtext)
 * Cards block: 2 cols per row: [image | text] per card item
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cta-tiles__item');
  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    const titleEl = item.querySelector('.cta-tiles__title, .field-title');
    const descEl = item.querySelector('.cta-tiles__description, .field-summary');

    // Col 1: image (empty for CTA tiles - no images in source)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));

    // Col 2: text content with link
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.appendChild(strong);
    }

    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = titleEl ? titleEl.textContent.trim() : link.textContent.trim();
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cta-tiles', cells });
  element.replaceWith(block);
}
