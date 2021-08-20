import { SelectorElement } from './selector-element';

/**
 * Selector for text link
 */
class SelectorImage extends SelectorElement<HTMLImageElement> {
  /**
   * @return {string} text inside element
   */
  public getContent() {
    if (this.htmlElement == null) {
      return null;
    }
    return this.htmlElement.src;
  }
}

export { SelectorImage };
