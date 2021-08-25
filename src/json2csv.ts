import { promisify } from 'util';
import { writeFile, access, mkdir } from 'fs';
import { parseAsync } from 'json2csv';

const promisedWriteFile = promisify(writeFile);
const promisedAccess = promisify(access);
const promisedMkdir = promisify(mkdir);

const jsonToCSV = async (
  fileName: string,
  data: Record<string, string | null>[]
) => {
  const resultFolder = './result/';

  try {
    await promisedAccess(resultFolder);
  } catch {
    promisedMkdir(resultFolder);
  }

  const fields = [
    'res-neighborhood',
    'res-type',
    'res-price',
    'res-type',
    'res-size',
    'res-permalink',
    'res-img',
  ];

  const opts = { fields };

  const result = await parseAsync(data, opts);

  await promisedWriteFile(
    `${resultFolder}${fileName.replace('.json', '.csv')}`,
    result
  );
};

export default jsonToCSV;
