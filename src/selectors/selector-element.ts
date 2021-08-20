type QuerySelector = typeof document.querySelector;
type Parent = {
  querySelector: QuerySelector;
};

/**
 * Represents a HTML Element
 */
class SelectorElement<T extends HTMLElement> {
  private _htmlElement: T | null;
  /**
   * @param {Parent} parent Parent element
   * @param {string} selector css selector
   */
  public constructor(parent: Parent, selector: string) {
    this._htmlElement = parent.querySelector(selector);
  }

  /**
   *
   * @return {boolean} Selector returns a valid HTML Element
   */
  public found(): boolean {
    return this._htmlElement != null;
  }

  /**
   * @return {T} HTML Element or content
   */
  public getContent(): string | null {
    return this.htmlElement != null ? this.htmlElement.innerHTML : null;
  }

  /**
   * @return {HTMLElement | null} Selected HTML Element
   */
  public get htmlElement(): T | null {
    return this._htmlElement;
  }
}

export { SelectorElement };
