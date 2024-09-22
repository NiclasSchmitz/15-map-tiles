export class Position {
  #row: number;
  #col: number;

  constructor(row: number, col: number) {
    this.#row = row;
    this.#col = col;
  }

  get row() {
    return this.#row;
  }

  get col() {
    return this.#col;
  }
}
