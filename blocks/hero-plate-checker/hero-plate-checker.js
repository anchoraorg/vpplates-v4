export default function decorate(block) {
  // Hero plate checker - two column layout with plate checker form
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Build two-column layout
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-plate-checker-content';

  const formCol = document.createElement('div');
  formCol.className = 'hero-plate-checker-form-col';

  const previewCol = document.createElement('div');
  previewCol.className = 'hero-plate-checker-preview-col';

  rows.forEach((row, i) => {
    if (i === 0) {
      // First row: heading and form content
      formCol.append(...row.children);
    } else {
      // Additional rows: preview content
      previewCol.append(...row.children);
    }
  });

  wrapper.append(formCol, previewCol);
  block.textContent = '';
  block.append(wrapper);
}
