import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Process each child div in the li
    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      if (pic && div.children.length === 1) {
        div.className = 'cta-tiles-card-image';
      } else {
        div.className = 'cta-tiles-card-body';

        // Restructure: wrap title + description in a link
        const link = div.querySelector('a');
        const strong = div.querySelector('strong');
        if (link && strong) {
          const href = link.href;
          const titleText = strong.textContent.trim();

          // Collect description text from non-link, non-title paragraphs
          let descText = '';
          div.querySelectorAll('p').forEach((p) => {
            if (!p.querySelector('strong') && !p.querySelector('a')) {
              descText = p.textContent.trim();
            }
          });

          // Rebuild the div contents
          div.textContent = '';
          const newLink = document.createElement('a');
          newLink.href = href;
          newLink.className = 'cta-tiles-tile-link';

          const content = document.createElement('div');
          content.className = 'cta-tiles-card-content';

          const titleSpan = document.createElement('span');
          titleSpan.className = 'cta-tiles-card-title';
          titleSpan.textContent = titleText;
          content.append(titleSpan);

          if (descText) {
            const descSpan = document.createElement('span');
            descSpan.className = 'cta-tiles-card-desc';
            descSpan.textContent = descText;
            content.append(descSpan);
          }

          newLink.append(content);
          div.append(newLink);
        }
      }
    });

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
