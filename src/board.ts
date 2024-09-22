import { Field } from "./field";
import { Position } from "./position";

export class Board {
  #dimension = 4;
  #urls: string[];
  #fields: Field[][];

  constructor(rootElement: HTMLDivElement) {
    this.#urls = this.#generateTileUrls(32748, 21787, 16, this.#dimension);
    this.#fields = this.#createFields();
    this.#renderBoard(rootElement);
  }

  get flattenedFields() {
    return this.#fields.reduce<Field[]>((acc, row) => {
      acc.push(...row);
      return acc;
    }, []);
  }

  get dimension() {
    return this.#dimension;
  }

  get emptyFieldPosition() {
    let position: Position | undefined;
    for (let row = 0; row < this.#dimension; row++) {
      for (let col = 0; col < this.#dimension; col++) {
        if (this.#fields[row][col].value === Math.pow(this.#dimension, 2)) {
          position = new Position(row, col);
        }
      }
    }

    if (typeof position === "undefined") {
      // TODO: What is the best approach to handle this case?
      throw new Error("This should never happen ...");
    }

    return position;
  }

  get width() {
    return this.#dimension - 1;
  }

  get height() {
    return this.#dimension - 1;
  }

  /**
   * Move a field to the left by one
   *
   * A field can be moved to the left, if it is on the right hand side of the empty field.
   *
   * @returns Whether or not the move was valid
   */
  left() {
    let isValid: boolean;

    const position = this.emptyFieldPosition;

    if (position.col === this.width) {
      isValid = false;
    } else {
      // Moving a field to the left means moving the empty one to the right
      const newPosition = new Position(position.row, position.col + 1);
      this.#swapFields(position, newPosition);
      isValid = true;
    }

    return isValid;
  }

  /**
   * Move a field to the right by one
   *
   * A field can be moved to the right, if it is on the left hand side of the empty field.
   *
   * @returns Whether or not the move was valid
   */
  right() {
    let isValid: boolean;

    const position = this.emptyFieldPosition;

    if (position.col === 0) {
      isValid = false;
    } else {
      // Moving a field to the right means moving the empty one to the left
      const newPosition = new Position(position.row, position.col - 1);
      this.#swapFields(position, newPosition);
      isValid = true;
    }

    return isValid;
  }

  /**
   * Move a field up by one
   *
   * A field can be moved up by one, if it is below of the empty field.
   *
   * @returns Whether or not the move was valid
   */
  up() {
    let isValid: boolean;

    const position = this.emptyFieldPosition;

    if (position.row === this.height) {
      isValid = false;
    } else {
      // Moving a field up means moving the empty one down
      const newPosition = new Position(position.row + 1, position.col);
      this.#swapFields(position, newPosition);
      isValid = true;
    }

    return isValid;
  }

  /**
   * Move a field down by one
   *
   * A field can be moved down by one, if it is above the empty field.
   *
   * @returns Whether or not the move was valid
   */
  down() {
    let isValid: boolean;

    const position = this.emptyFieldPosition;

    if (position.row === 0) {
      isValid = false;
    } else {
      // Moving a field up means moving the empty one down
      const newPosition = new Position(position.row - 1, position.col);
      this.#swapFields(position, newPosition);
      isValid = true;
    }

    return isValid;
  }

  move(field: Field) {
    let isValid: boolean;

    // Get Position of field
    const fieldPosition = this.#getPosition(field);
    const emptyFieldPosition = this.emptyFieldPosition;

    // Check if fields are adjacent
    const deltaCol = fieldPosition.col - emptyFieldPosition.col;
    const deltaRow = fieldPosition.row - emptyFieldPosition.row;
    if (
      (Math.abs(deltaCol) === 1 && deltaRow === 0) ||
      (Math.abs(deltaRow) === 1 && deltaCol === 0)
    ) {
      this.#swapFields(fieldPosition, emptyFieldPosition);
      isValid = true;
    } else {
      isValid = false;
    }

    return isValid;
  }

  #getPosition(field: Field) {
    let position: Position | undefined;
    for (let row = 0; row < this.#dimension; row++) {
      for (let col = 0; col < this.#dimension; col++) {
        // TODO: Is it okay to compare the instance, or would it be better to compare the value property?
        if (this.#fields[row][col] === field) {
          position = new Position(row, col);
        }
      }
    }

    if (typeof position === "undefined") {
      // TODO: What is the best approach to handle this case?
      throw new Error("This should never happen ...");
    }

    return position;
  }

  #createFields() {
    const fields: Field[][] = [];

    let counter: number = 0;
    for (let row = 0; row < this.#dimension; row++) {
      fields.push([]);
      for (let col = 0; col < this.#dimension; col++) {
        const url = this.#urls[counter];
        counter += 1;
        fields[row].push(new Field(counter, url));
      }
    }

    return fields;
  }

  #renderBoard(rootElement: HTMLDivElement) {
    for (let row = 0; row < this.#fields.length; row++) {
      for (let col = 0; col < this.#fields[row].length; col++) {
        rootElement.append(this.#fields[row][col].element);
      }
    }
  }

  #swapFields(first: Position, second: Position) {
    // Read global css variables
    const documentElement = document.documentElement;
    const computedStyles = getComputedStyle(documentElement);
    const fieldSize = parseInt(
      computedStyles.getPropertyValue("--field-size"),
      10
    );
    const margin = parseInt(computedStyles.getPropertyValue("--margin"), 10);

    const firstField = this.#fields[first.row][first.col];
    const secondField = this.#fields[second.row][second.col];

    this.#fields[first.row][first.col] = secondField;
    this.#fields[second.row][second.col] = firstField;

    // update ui
    firstField.element.style.top = `${
      second.row * fieldSize + (second.row + 1) * margin
    }px`;
    firstField.element.style.left = `${
      second.col * fieldSize + (second.col + 1) * margin
    }px`;

    secondField.element.style.top = `${
      first.row * fieldSize + (first.row + 1) * margin
    }px`;
    secondField.element.style.left = `${
      first.col * fieldSize + (first.col + 1) * margin
    }px`;
  }

  #generateTileUrls(
    xStart: number,
    yStart: number,
    z: number,
    numTiles: number
  ) {
    const urls = [];

    for (let row = 0; row < numTiles; row++) {
      for (let col = 0; col < numTiles; col++) {
        const x = xStart + col;
        const y = yStart + row;
        const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
        urls.push(url);
      }
    }

    return urls;
  }
}
