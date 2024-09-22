import { Board } from "./board";
import { Field } from "./field";

export type GameOptions = {
  board: HTMLDivElement;
  steps: HTMLDivElement;
  time: HTMLDivElement;
  notification: HTMLDivElement;
  start: HTMLButtonElement;
};

export class Game {
  #options: GameOptions;
  #board: Board;
  #steps: number = 0;
  #intervalId: number | undefined = undefined;

  constructor(options: GameOptions) {
    this.#options = options;
    this.#board = new Board(options.board);
    this.addStartGameButtonListener();
  }

  #isWinner() {
    return this.#isSorted(this.#board.flattenedFields);
  }

  #isSorted(flattenedFields: Field[]) {
    for (let i = 1; i < flattenedFields.length; i++) {
      if (flattenedFields[i - 1].value > flattenedFields[i].value) {
        return false;
      }
    }
    return true;
  }

  #start() {
    this.#shuffle();
    this.#resetTimer();
    this.#resetSteps();
    this.#displaySteps();
    this.#initKeyEvents();
    this.#initMouseEvents();
    this.#hideWinner();
  }

  #stop() {
    this.#stopTimer();
    this.#terminateKeyEvents();
    this.#terminateMouseEvents();
  }

  #updateOnValidStep() {
    // Start the timer with the first valid step
    if (this.#steps === 0) {
      this.#startTimer();
    }

    this.#steps += 1;
    this.#displaySteps();

    if (this.#isWinner()) {
      this.#displayWinner();
      this.#stop();
    }
  }

  #initKeyEvents() {
    document.onkeydown = (e) => {
      let isValid: boolean = false;

      switch (e.code) {
        case "ArrowDown":
          isValid = this.#board.down();
          break;
        case "ArrowUp":
          isValid = this.#board.up();
          break;
        case "ArrowLeft":
          isValid = this.#board.left();
          break;
        case "ArrowRight":
          isValid = this.#board.right();
          break;
      }

      if (isValid) {
        this.#updateOnValidStep();
      }
    };
  }

  #terminateKeyEvents() {
    document.onkeydown = null;
  }

  #initMouseEvents() {
    this.#board.flattenedFields.map((field) => {
      field.element.onclick = (_event) => {
        const isValid = this.#board.move(field);

        if (isValid) {
          this.#updateOnValidStep();
        }
      };
    });
  }

  #terminateMouseEvents() {
    this.#board.flattenedFields.map((field) => {
      field.element.onclick = null;
    });
  }

  addStartGameButtonListener() {
    this.#options.start.onclick = (_event) => {
      this.#stop();
      this.#start();
    };
  }

  #shuffle(numberOfSteps = 200) {
    let i = 0;
    while (i <= numberOfSteps) {
      const random = Math.random();
      let isValid: boolean;
      if (random < 0.25) {
        isValid = this.#board.left();
      } else if (random < 0.5) {
        isValid = this.#board.right();
      } else if (random < 0.75) {
        isValid = this.#board.up();
      } else {
        isValid = this.#board.down();
      }

      if (isValid) {
        i += 1;
      }
    }
  }

  #displaySteps() {
    this.#options.steps.innerHTML = this.#steps.toString();
  }

  #startTimer() {
    // Prevent starting multiple timers
    if (typeof this.#intervalId === "number") {
      return;
    }

    const TIMEOUT_MS = 1000;
    let seconds: number = 0;
    this.#intervalId = setInterval(() => {
      this.#options.time.innerHTML = this.#formatSeconds(seconds);
      seconds += 1;
    }, TIMEOUT_MS);
  }

  #formatSeconds(totalInSeconds: number) {
    const minutes = Math.floor(totalInSeconds / 60);
    const minutesFormatted = minutes.toString().padStart(2, "0");
    const seconds = totalInSeconds % 60;
    const secondsFormatted = seconds.toString().padStart(2, "0");

    return `${minutesFormatted}:${secondsFormatted}`;
  }

  #stopTimer() {
    clearInterval(this.#intervalId);
    this.#intervalId = undefined;
  }

  #resetTimer() {
    this.#options.time.innerHTML = "00:00";
  }

  #resetSteps() {
    this.#steps = 0;
  }

  #displayWinner() {
    this.#options.notification.innerHTML = "You won!";
  }

  #hideWinner() {
    this.#options.notification.innerHTML = "";
  }
}
