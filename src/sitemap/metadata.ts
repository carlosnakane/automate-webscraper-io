interface SitemapData {
  _id: string;
  startUrl: string[];
  selectors: Selector[];
}

interface Selector {
  id: string;
  type: SelectorTypes;
  parentSelectors: string[];
  selector: string;
  multiple: boolean;
  delay: number;
  regex: string;
}

type SelectorTypes =
  | 'SelectorElement'
  | 'SelectorText'
  | 'SelectorLink'
  | 'SelectorImage';

export { Selector, SelectorTypes, SitemapData };
