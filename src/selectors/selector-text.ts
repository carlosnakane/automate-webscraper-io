import { SelectorElement } from './selector-element';

/**
 * Selector for text content
 */
class SelectorText extends SelectorElement<HTMLElement> {
  /**
   * @return {string} text inside element
   */
  public getContent() {
    return this.htmlElement != null ? this.htmlElement.textContent : null;
  }
}

export { SelectorText };
