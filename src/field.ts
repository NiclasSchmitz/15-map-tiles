export class Field {
  #element: HTMLDivElement;

  constructor(value: number, imageUrl: string) {
    this.#element = this.#createElement(value, imageUrl);
  }

  get value() {
    const rawValue = this.#element.id.match(/\d+/)![0];
    return parseInt(rawValue, 10);
  }

  get element() {
    return this.#element;
  }

  #createElement(value: number, imageUrl: string) {
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = `field-${value}`;

    const numberElement = document.createElement("span");
    numberElement.innerHTML = value.toString();

    const element = document.createElement("div");
    element.classList.add("field");
    element.id = `field-${value}`;
    element.appendChild(imageElement);
    element.appendChild(numberElement);

    return element;
  }
}
