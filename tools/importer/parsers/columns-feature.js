/* eslint-disable */
/* global WebImporter */
/**
 * columns-feature parser. Base: columns. vplates
 * Columns blocks do NOT require field hints (xwalk exception)
 * Columns block: multiple cols per row: [col1 | col2] per row
 */
export default function parse(element, { document }) {
  const rows = [...element.children];
  const cells = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const rowCells = [];

    cols.forEach((col) => {
      const cellContent = document.createDocumentFragment();
      while (col.firstChild) {
        cellContent.appendChild(col.firstChild);
      }
      rowCells.push(cellContent);
    });

    if (rowCells.length > 0) {
      cells.push(rowCells);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
