/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: vplates sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only (after block parsing, before final metadata).
 * Selectors from captured DOM of vplates.com.au (Sitecore source).
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to preserve DOM positions
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the section element using its selector
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add section break (<hr>) before section element (skip first section)
      const isFirst = section === template.sections[0];
      if (!isFirst && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
