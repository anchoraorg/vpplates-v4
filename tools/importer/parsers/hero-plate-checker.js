/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-plate-checker. Base: hero. Source: vplates.com.au homepage
 * Model fields: image (ref), imageAlt (collapsed), text (richtext)
 * Hero block: 1 col, 3 rows: [name], [image], [text content]
 */
export default function parse(element, { document }) {
  // Extract background image from plate preview area
  const bgImage = element.querySelector('.quick-combo__output img, .quick-combo__output-combo img');

  // Extract heading
  const heading = element.querySelector('.quick-combo__title, h2');

  // Extract description/form text and CTAs
  const seePopularLink = element.querySelector('.quick-combo__next-component-cta, a[href*="popular"]');
  const disclaimer = element.querySelector('.quick-combo__disclaimer');

  // Build cells matching hero block library structure:
  // Row 1: background image (field: image)
  // Row 2: text content (field: text) - heading + description + CTA
  const cells = [];

  // Row 1: image
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (bgImage) {
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = bgImage.src || '';
    img.alt = bgImage.alt || 'Plate preview';
    pic.appendChild(img);
    imageCell.appendChild(pic);
  }
  cells.push([imageCell]);

  // Row 2: text content (heading + description + CTA)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.appendChild(h2);
  }

  // Add description paragraph
  const desc = document.createElement('p');
  desc.textContent = 'Check your personalised plate combination for cars and motorbikes.';
  textCell.appendChild(desc);

  // Add CTA link
  if (seePopularLink) {
    const link = document.createElement('a');
    link.href = seePopularLink.href || '#';
    link.textContent = seePopularLink.textContent.trim() || 'See popular plates';
    textCell.appendChild(link);
  }

  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-plate-checker', cells });
  element.replaceWith(block);
}
