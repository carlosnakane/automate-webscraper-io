import { promisify } from 'util';
import { readFile } from 'fs';
import { SitemapData } from './metadata';
import scrapper from './scrapper';
import jsonToCSV from '../json2csv';

const promisedReadFile = promisify(readFile);

const sitemap = async (siteMapFilePath: string) => {
  const siteMap = JSON.parse(
    await promisedReadFile(siteMapFilePath, 'utf-8')
  ) as SitemapData;

  let scrappingCount = 0;
  for (const url of siteMap.startUrl) {
    const result = await scrapper(url, siteMap.selectors);
    if (result != null) {
      await jsonToCSV(`${siteMap._id}-${scrappingCount}`, result);
    }

    scrappingCount += 1;
  }
};

export default sitemap;
