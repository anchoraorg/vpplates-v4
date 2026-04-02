// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabBlockCnt = 0;

export default async function decorate(block) {
  // Filter to only rows that have content (skip empty rows from fresh UE drop)
  const rows = [...block.children].filter(
    (child) => child.firstElementChild && child.firstElementChild.textContent.trim(),
  );

  // If no content rows, show empty state
  if (rows.length === 0) {
    block.innerHTML = '<p class="tabs-promo-gallery-empty">Add tab items using the + button to get started.</p>';
    return;
  }

  // Build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-promo-gallery-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  rows.forEach((row, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;
    const tabHeading = row.firstElementChild;
    const tabLabel = tabHeading ? tabHeading.textContent.trim() : `Tab ${i + 1}`;

    // Decorate the row as a tabpanel
    row.className = 'tabs-promo-gallery-panel';
    row.id = id;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    // Build tab button
    const button = document.createElement('button');
    button.className = 'tabs-promo-gallery-tab';
    button.id = `tab-${id}`;
    button.textContent = tabLabel;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);

    // Hide the tab title cell visually (keep in DOM for UE authoring)
    if (tabHeading) {
      tabHeading.classList.add('tabs-promo-gallery-label');
    }

    // Move instrumentation from heading elements inside the button
    const headingEl = tabHeading ? tabHeading.querySelector('h1, h2, h3, h4, h5, h6') : null;
    if (headingEl) {
      moveInstrumentation(headingEl, null);
    }
  });

  block.prepend(tablist);
}
