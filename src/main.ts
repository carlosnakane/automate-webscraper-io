import { promisify } from 'util';
import { readdir } from 'fs';

const promisedReaddir = promisify(readdir);

import scrapper from './sitemap/scrapper';
import jsonToCSV from './json2csv';

(async () => {
  const sitemapsFolder = './site-maps/';
  const files = await promisedReaddir(sitemapsFolder);

  for (const f of files) {
    const result = await scrapper(`${sitemapsFolder}${f}`);
    if (result != null) {
      jsonToCSV(f, result);
    }
  }
})();
