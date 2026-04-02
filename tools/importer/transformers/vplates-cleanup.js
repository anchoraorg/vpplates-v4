/* eslint-disable */
/* global WebImporter */

/**
 * vplates cleanup transformer (with wayback support).
 * Selectors from captured DOM of vplates.com.au (Sitecore source).
 * Removes non-authorable site chrome (header, footer, flyout nav, search, overlays, scripts).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove Wayback Machine toolbar and artifacts (when importing via web.archive.org)
    WebImporter.DOMUtils.remove(element, [
      '#wm-ipp-base',
      '#wm-ipp',
      '#donato',
      '#playback',
      '#wm-ipp-print',
    ]);

    // Remove Wayback Machine text nodes (e.g., "The Wayback Machine - https://...")
    element.querySelectorAll('p').forEach((p) => {
      if (p.textContent.includes('Wayback Machine')) p.remove();
    });

    // Remove interactive elements that interfere with parsing (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.tooltip',
      '.error-bar',
      '.quick-combo__load-complete',
      '.quick-combo__load-incomplete',
      'noscript',
      'script',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header.header',
      'footer.footer',
      '.flyout-nav',
      '.component.plain-html.search',
      'a.visuallyhidden',
      '.visuallyhidden--no-focus',
      'iframe',
      'link',
    ]);

    // Clean tracking attributes from remaining elements
    element.querySelectorAll('[data-sc-component]').forEach((el) => {
      el.removeAttribute('data-sc-component');
    });
    element.querySelectorAll('[data-component-name]').forEach((el) => {
      el.removeAttribute('data-component-name');
    });
  }
}
