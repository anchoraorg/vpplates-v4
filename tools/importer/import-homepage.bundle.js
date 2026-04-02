var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-plate-checker.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".quick-combo__output img, .quick-combo__output-combo img");
    const heading = element.querySelector(".quick-combo__title, h2");
    const seePopularLink = element.querySelector('.quick-combo__next-component-cta, a[href*="popular"]');
    const disclaimer = element.querySelector(".quick-combo__disclaimer");
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (bgImage) {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = bgImage.src || "";
      img.alt = bgImage.alt || "Plate preview";
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textCell.appendChild(h2);
    }
    const desc = document.createElement("p");
    desc.textContent = "Check your personalised plate combination for cars and motorbikes.";
    textCell.appendChild(desc);
    if (seePopularLink) {
      const link = document.createElement("a");
      link.href = seePopularLink.href || "#";
      link.textContent = seePopularLink.textContent.trim() || "See popular plates";
      textCell.appendChild(link);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-plate-checker", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta-tiles.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".cta-tiles__item");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a");
      const titleEl = item.querySelector(".cta-tiles__title, .field-title");
      const descEl = item.querySelector(".cta-tiles__description, .field-summary");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        textCell.appendChild(strong);
      }
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        textCell.appendChild(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = titleEl ? titleEl.textContent.trim() : link.textContent.trim();
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cta-tiles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-promo-gallery.js
  function parse3(element, { document }) {
    const tabButtons = element.querySelectorAll(".promo-gallery__tab-nav-btn");
    const tabPanels = element.querySelectorAll(".promo-tabs__promo-item");
    const cells = [];
    tabButtons.forEach((btn, i) => {
      const tabLabel = btn.textContent.trim();
      const panel = tabPanels[i];
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(" field:title "));
      titleCell.appendChild(document.createTextNode(tabLabel));
      const contentCell = document.createDocumentFragment();
      if (panel) {
        const carouselTitle = panel.querySelector(".promo-carousel__title, h3");
        const carouselList = panel.querySelector(".promo-carousel__list");
        const carouselItems = carouselList ? carouselList.querySelectorAll(":scope > li.carousel-item") : panel.querySelectorAll("li.carousel-item");
        const seenTitles = /* @__PURE__ */ new Set();
        const uniqueItems = [...carouselItems].filter((item) => {
          const t = item.querySelector(".carousel-item__panel-title, h4");
          const key = t ? t.textContent.trim() : "";
          if (!key || seenTitles.has(key)) return false;
          seenTitles.add(key);
          return true;
        });
        if (carouselTitle) {
          contentCell.appendChild(document.createComment(" field:content_heading "));
          const h3 = document.createElement("h3");
          h3.textContent = carouselTitle.textContent.trim();
          contentCell.appendChild(h3);
        }
        const firstItem = uniqueItems[0] || panel;
        const img = firstItem.querySelector(".carousel-item__panel-background-image, .carousel-item__panel-image, img");
        if (img) {
          contentCell.appendChild(document.createComment(" field:content_image "));
          const pic = document.createElement("picture");
          const imgEl = document.createElement("img");
          imgEl.src = img.src || img.getAttribute("data-src") || "";
          imgEl.alt = img.alt || tabLabel;
          pic.appendChild(imgEl);
          contentCell.appendChild(pic);
        }
        contentCell.appendChild(document.createComment(" field:content_richtext "));
        uniqueItems.forEach((item) => {
          const title = item.querySelector(".carousel-item__panel-title, h4");
          const text = item.querySelector(".carousel-item__content-text p");
          const cta = item.querySelector(".carousel-item__content-cta");
          if (title) {
            const h4 = document.createElement("h4");
            h4.textContent = title.textContent.trim();
            contentCell.appendChild(h4);
          }
          if (text) {
            const p = document.createElement("p");
            p.textContent = text.textContent.trim();
            contentCell.appendChild(p);
          }
          if (cta) {
            const a = document.createElement("a");
            a.href = cta.href || "#";
            a.textContent = cta.textContent.trim() || "Learn more";
            contentCell.appendChild(a);
          }
        });
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-promo-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll('.carousel-item, [class*="carousel-item"]');
    const cells = [];
    items.forEach((item) => {
      const panelImg = item.querySelector(".carousel-item__panel-foreground img, .carousel-item__panel-image, img");
      const bgImg = item.querySelector(".carousel-item__panel-background-image");
      const title = item.querySelector(".carousel-item__panel-title, h4");
      const text = item.querySelector(".carousel-item__panel-text, .carousel-item__content-text p");
      const cta = item.querySelector('.carousel-item__content-cta, a[class*="cta"]');
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      const img = panelImg || bgImg;
      if (img) {
        const pic = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src || img.getAttribute("data-src") || "";
        imgEl.alt = img.alt || (title ? title.textContent.trim() : "");
        pic.appendChild(imgEl);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) {
        const h4 = document.createElement("h4");
        h4.textContent = title.textContent.trim();
        textCell.appendChild(h4);
      }
      if (text) {
        const p = document.createElement("p");
        p.textContent = text.textContent.trim();
        textCell.appendChild(p);
      }
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href || "#";
        a.textContent = cta.textContent.trim() || "Learn more";
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-feed.js
  function parse5(element, { document }) {
    const holder = element.querySelector(".instagram__holder");
    const iframe = holder ? holder.querySelector("iframe") : null;
    const cells = [];
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(" field:embed_uri "));
    const feedUrl = iframe ? iframe.src : "https://snapwidget.com/embed/1008188";
    const link = document.createElement("a");
    link.href = feedUrl;
    link.textContent = feedUrl;
    contentCell.appendChild(link);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "social-feed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vplates-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".tooltip",
        ".error-bar",
        ".quick-combo__load-complete",
        ".quick-combo__load-incomplete",
        "noscript",
        "script"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.header",
        "footer.footer",
        ".flyout-nav",
        ".component.plain-html.search",
        "a.visuallyhidden",
        ".visuallyhidden--no-focus",
        "iframe",
        "link"
      ]);
      element.querySelectorAll("[data-sc-component]").forEach((el) => {
        el.removeAttribute("data-sc-component");
      });
      element.querySelectorAll("[data-component-name]").forEach((el) => {
        el.removeAttribute("data-component-name");
      });
    }
  }

  // tools/importer/transformers/vplates-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        const isFirst = section === template.sections[0];
        if (!isFirst && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-plate-checker": parse,
    "cta-tiles": parse2,
    "tabs-promo-gallery": parse3,
    "cards-product": parse4,
    "social-feed": parse5,
    "columns-feature": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.vplates.com.au/"
    ],
    description: "Homepage template with hero plate checker, tabbed product gallery, CTA tiles, social feed, and standard header/footer",
    blocks: [
      {
        name: "header",
        instances: ["header.header"]
      },
      {
        name: "hero-plate-checker",
        instances: [".component.quick-combo"]
      },
      {
        name: "cta-tiles",
        instances: [".cta-tiles__list"]
      },
      {
        name: "tabs-promo-gallery",
        instances: [".promo-gallery"]
      },
      {
        name: "social-feed",
        instances: [".instagram"]
      },
      {
        name: "footer",
        instances: ["footer.footer"]
      }
    ],
    sections: [
      {
        id: "section-1-header",
        name: "Header",
        selector: "header.header",
        style: "dark",
        blocks: ["header"],
        defaultContent: []
      },
      {
        id: "section-2-alert-banner",
        name: "Alert Banner",
        selector: ".promo-banner",
        style: "accent-yellow",
        blocks: [],
        defaultContent: [".promo-banner__text"]
      },
      {
        id: "section-3-hero-plate-checker",
        name: "Hero Plate Checker",
        selector: ".component.quick-combo",
        style: "dark",
        blocks: ["hero-plate-checker"],
        defaultContent: []
      },
      {
        id: "section-4-key-tasks",
        name: "Key Tasks Navigation",
        selector: ".cta-tiles__list",
        style: null,
        blocks: ["cta-tiles"],
        defaultContent: []
      },
      {
        id: "section-5-product-carousel",
        name: "Product Category Carousel",
        selector: ".promo-gallery",
        style: "light-grey",
        blocks: ["tabs-promo-gallery"],
        defaultContent: []
      },
      {
        id: "section-6-social-feed",
        name: "Social Media Feed",
        selector: ".instagram",
        style: null,
        blocks: ["social-feed"],
        defaultContent: [".instagram__title"]
      },
      {
        id: "section-7-footer",
        name: "Footer",
        selector: "footer.footer",
        style: "dark",
        blocks: ["footer"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
