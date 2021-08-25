import { promisify } from 'util';
import { readFile } from 'fs';
import { SitemapData, SelectorTypes } from './metadata';
import { launch } from 'puppeteer';

const promisedReadFile = promisify(readFile);

const getSitemapRootSelector = (sitemapData: SitemapData) => {
  return sitemapData.selectors.find(
    (s) => s.parentSelectors.find((p) => p === '_root') != null
  );
};

const scrapper = async (siteMapFilePath: string) => {
  const siteMap = JSON.parse(
    await promisedReadFile(siteMapFilePath, 'utf-8')
  ) as SitemapData;

  const startUrl = siteMap.startUrl[0];

  console.log('>', startUrl);

  if (startUrl == null) {
    throw new Error('startUrl can not be null');
  }

  const browser = await launch();
  const page = await browser.newPage();
  let extracted = null;

  try {
    await page.goto(startUrl);

    const root = getSitemapRootSelector(siteMap);
    if (root == null) {
      throw new Error('startUrl can not be null');
    }

    await page.waitForSelector(root.selector);

    extracted = await page.evaluate((sitemapSerial: string) => {
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
        const data: Record<string, string | null> = {};
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
  } catch (error) {
    console.log(`Error extracting ${siteMapFilePath}`);
  }

  await browser.close();
  return extracted;
};
export default scrapper;
