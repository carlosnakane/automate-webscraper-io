import { SelectorElement } from './selector-element';

/**
 * Selector for text link
 */
class SelectorLink extends SelectorElement<HTMLAnchorElement> {
  /**
   * @return {string} text inside element
   */
  public getContent() {
    if (this.htmlElement == null) {
      return null;
    }
    return this.htmlElement.href;
  }
}

export { SelectorLink };
