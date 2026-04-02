/* eslint-disable */
/* global WebImporter */
/**
 * social-feed. Base: embed. vplates homepage
 * Model fields: embed_placeholder (ref), embed_placeholderAlt (collapsed), embed_uri (text)
 * Embed block: 1 col, 2 rows: [name], [placeholder image + URI]
 */
export default function parse(element, { document }) {
  const holder = element.querySelector('.instagram__holder');
  const iframe = holder ? holder.querySelector('iframe') : null;

  const cells = [];

  // Single row: embed URI (and optional placeholder image)
  const contentCell = document.createDocumentFragment();

  // Add feed URI
  contentCell.appendChild(document.createComment(' field:embed_uri '));
  const feedUrl = iframe ? iframe.src : 'https://snapwidget.com/embed/1008188';
  const link = document.createElement('a');
  link.href = feedUrl;
  link.textContent = feedUrl;
  contentCell.appendChild(link);

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-feed', cells });
  element.replaceWith(block);
}
