import { promisify } from 'util';
import { readdir } from 'fs';

const promisedReaddir = promisify(readdir);

import sitemap from './sitemap';

(async () => {
  const sitemapsFolder = './site-maps/';
  const files = await promisedReaddir(sitemapsFolder);

  for (const f of files) {
    await sitemap(`${sitemapsFolder}${f}`);
  }
})();
