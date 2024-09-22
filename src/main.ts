import { Game } from "./game";
import "./style.css";

const boardElement = document.querySelector<HTMLDivElement>("#board");
const startElement = document.querySelector<HTMLButtonElement>("#start");
const stepsValueElement =
  document.querySelector<HTMLDivElement>("#steps-value");
const timeValueElement = document.querySelector<HTMLDivElement>("#time-value");
const notificationElement =
  document.querySelector<HTMLDivElement>("#notification");

if (
  !boardElement ||
  !startElement ||
  !stepsValueElement ||
  !timeValueElement ||
  !notificationElement
) {
  throw new Error("Element(s) not found");
}

new Game({
  board: boardElement,
  start: startElement,
  steps: stepsValueElement,
  time: timeValueElement,
  notification: notificationElement,
});
