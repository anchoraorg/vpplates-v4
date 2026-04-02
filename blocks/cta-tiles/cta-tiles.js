import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Filter to rows that have actual content
  const rows = [...block.children].filter(
    (row) => row.textContent.trim(),
  );

  // If no content rows, leave DOM untouched for Universal Editor to manage
  if (rows.length === 0) return;

  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // New model: 3 cells per row → heading | description | link
    const cells = [...row.children];
    const headingCell = cells[0];
    const descCell = cells[1];
    const linkCell = cells[2];

    const headingText = headingCell ? headingCell.textContent.trim() : '';
    const descText = descCell ? descCell.textContent.trim() : '';
    const linkEl = linkCell ? linkCell.querySelector('a') : null;
    const href = linkEl ? linkEl.href : '#';

    // Build tile as a single clickable link
    const tileLink = document.createElement('a');
    tileLink.href = href;
    tileLink.className = 'cta-tiles-tile-link';

    const content = document.createElement('div');
    content.className = 'cta-tiles-card-content';

    if (headingText) {
      const titleSpan = document.createElement('span');
      titleSpan.className = 'cta-tiles-card-title';
      titleSpan.textContent = headingText;
      content.append(titleSpan);
    }

    if (descText) {
      const descSpan = document.createElement('span');
      descSpan.className = 'cta-tiles-card-desc';
      descSpan.textContent = descText;
      content.append(descSpan);
    }

    // Chevron arrow
    const chevron = document.createElement('span');
    chevron.className = 'cta-tiles-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '›';

    tileLink.append(content, chevron);
    li.append(tileLink);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
