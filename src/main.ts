import { promisify } from 'util';
import { readFile } from 'fs';
import { Selector, SitemapData, SelectorTypes } from './sitemap/metadata';
import { launch, Page } from 'puppeteer';
import { SelectorElement } from './selectors/selector-element';
import { SelectorImage } from './selectors/selector-link-image';
import { SelectorLink } from './selectors/selector-link';
import { SelectorText } from './selectors/selector-text';

const readFileAsync = promisify(readFile);

const getSitemapRootSelector = (sitemap: SitemapData) => {
  return sitemap.selectors.find(
    (s) => s.parentSelectors.find((p) => p === '_root') != null
  );
};

const program = async () => {
  const siteMap = JSON.parse(
    await readFileAsync('./site-maps/pardini.json', 'utf-8')
  ) as SitemapData;

  const startUrl = siteMap.startUrl[0];

  console.log('>', startUrl);

  if (startUrl == null) {
    throw new Error('startUrl can not be null');
  }

  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(startUrl);

  const rootSelector = getSitemapRootSelector(siteMap);
  if (rootSelector == null) {
    throw new Error('startUrl can not be null');
  }

  await page.waitForSelector(rootSelector.selector);

  const a = await page.evaluate((sitemapSerial: string) => {
    const sitemap = JSON.parse(sitemapSerial) as SitemapData;

    const rootSelector = sitemap.selectors.find(
      (s) => s.parentSelectors[0] === '_root'
    );

    if (rootSelector == null) {
      throw new Error('Root Selector not found');
    }

    const selectors = sitemap.selectors.filter(
      (s) => s.parentSelectors[0] !== '_root'
    );

    const rootElements = document.querySelectorAll(rootSelector.selector);

    return Array.from(rootElements).map((r) => {
      const data: { [index: string]: string | null } = {};
      selectors.forEach((s) => {
        const element = r.querySelector(s.selector);
        data[s.id] = getContent(s.type, element, s.regex);
      });

      return data;
    });

    /**
     * Hoisting
     */

    /**
     *
     * @param {SelectorTypes} type selector tyupe
     * @param {Element | null} element html element
     * @param {string}regex regex
     * @return {string | null}
     */
    function getContent(
      type: SelectorTypes,
      element: Element | null,
      regex: string
    ): string | null {
      const regexContent = (content: string | null) => {
        if (regex == null || regex.length === 0 || content == null) {
          return content;
        }
        const r = new RegExp(regex);
        const result = r.exec(content);
        return result != null && result[0] != null ? result[0] : content;
      };
      if (element == null) {
        return null;
      }
      if (type === 'SelectorText') {
        return regexContent(element.textContent);
      }
      if (type === 'SelectorImage') {
        return regexContent((element as HTMLImageElement).src);
      }
      if (type === 'SelectorLink') {
        return regexContent((element as HTMLAnchorElement).href);
      }

      return null;
    }
  }, JSON.stringify(siteMap));

  console.log(a);

  await browser.close();
};

program();
