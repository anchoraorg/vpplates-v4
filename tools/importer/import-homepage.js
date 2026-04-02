/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPlateCheckerParser from './parsers/hero-plate-checker.js';
import ctaTilesParser from './parsers/cta-tiles.js';
import tabsPromoGalleryParser from './parsers/tabs-promo-gallery.js';
import cardsProductParser from './parsers/cards-product.js';
import socialFeedParser from './parsers/social-feed.js';
import columnsFeatureParser from './parsers/columns-feature.js';

// TRANSFORMER IMPORTS
import vplatesCleanupTransformer from './transformers/vplates-cleanup.js';
import vplatesSectionsTransformer from './transformers/vplates-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-plate-checker': heroPlateCheckerParser,
  'cta-tiles': ctaTilesParser,
  'tabs-promo-gallery': tabsPromoGalleryParser,
  'cards-product': cardsProductParser,
  'social-feed': socialFeedParser,
  'columns-feature': columnsFeatureParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.vplates.com.au/'
  ],
  description: 'Homepage template with hero plate checker, tabbed product gallery, CTA tiles, social feed, and standard header/footer',
  blocks: [
    {
      name: 'header',
      instances: ['header.header']
    },
    {
      name: 'hero-plate-checker',
      instances: ['.component.quick-combo']
    },
    {
      name: 'cta-tiles',
      instances: ['.cta-tiles__list']
    },
    {
      name: 'tabs-promo-gallery',
      instances: ['.promo-gallery']
    },
    {
      name: 'social-feed',
      instances: ['.instagram']
    },
    {
      name: 'footer',
      instances: ['footer.footer']
    }
  ],
  sections: [
    {
      id: 'section-1-header',
      name: 'Header',
      selector: 'header.header',
      style: 'dark',
      blocks: ['header'],
      defaultContent: []
    },
    {
      id: 'section-2-alert-banner',
      name: 'Alert Banner',
      selector: '.promo-banner',
      style: 'accent-yellow',
      blocks: [],
      defaultContent: ['.promo-banner__text']
    },
    {
      id: 'section-3-hero-plate-checker',
      name: 'Hero Plate Checker',
      selector: '.component.quick-combo',
      style: 'dark',
      blocks: ['hero-plate-checker'],
      defaultContent: []
    },
    {
      id: 'section-4-key-tasks',
      name: 'Key Tasks Navigation',
      selector: '.cta-tiles__list',
      style: null,
      blocks: ['cta-tiles'],
      defaultContent: []
    },
    {
      id: 'section-5-product-carousel',
      name: 'Product Category Carousel',
      selector: '.promo-gallery',
      style: 'light-grey',
      blocks: ['tabs-promo-gallery'],
      defaultContent: []
    },
    {
      id: 'section-6-social-feed',
      name: 'Social Media Feed',
      selector: '.instagram',
      style: null,
      blocks: ['social-feed'],
      defaultContent: ['.instagram__title']
    },
    {
      id: 'section-7-footer',
      name: 'Footer',
      selector: 'footer.footer',
      style: 'dark',
      blocks: ['footer'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  vplatesCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [vplatesSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
