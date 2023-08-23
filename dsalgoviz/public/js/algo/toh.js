"use strict";
const MAIN_CONTAINER = document.querySelector(".toh-container");
const PEG_CONTAINER = document.querySelector(".pegs");
const DISK_CONTAINER = document.querySelector(".disks");
const SELECT = document.querySelector("#number");
const RANGE = document.querySelector("#speed");
const PLAY_ALL = document.querySelector("#play");
const NEXT = document.querySelector("#next");
const RESTART = document.querySelector("#restart");
const EXTRA_PEG_HEIGHT = 50;
const codeSections = [
  "function",
  "return-condition",
  "toh-first",
  "move",
  "toh-last",
];
let tohCalls = [];

let time = 1.01 - +RANGE.value / 1000;
const resetTime = () => {
  time = 1.01 - +RANGE.value / 1000;
};
function toh(noOfDisks) {
  const steps = [];
  tohCalls = [];

  function recurse(n, from, to, aux) {
    tohCalls.push("function");

    tohCalls.push("return-condition");
    if (n === 0) return;

    tohCalls.push("toh-first");
    recurse(n - 1, from, aux, to);

    tohCalls.push("move");
    steps.push({ n, from, to, aux });

    tohCalls.push("toh-last");
    recurse(n - 1, aux, to, from);
  }
  recurse(noOfDisks, 0, 2, 1);
  return steps;
}
function calcDistance(container, peg) {
  const { left: left1 } = container.getBoundingClientRect();
  const { left: left2, width } = peg.getBoundingClientRect();
  return left2 - left1 + width / 2;
}
const debounce = (func, timeout = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};
function sleep(t = time) {
  return new Promise((resolve) => setTimeout(resolve, t * 1000));
}
// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
let rand = Math.random();
function randomColor(s = 80, l = 80) {
  rand = (rand + 1.618033988749895) % 1;
  return `hsl(${rand * 360}, ${s}%, ${l}%)`;
}
function setPegHeight(disk, noOfDisks, pegs) {
  const diskRect = disk.getBoundingClientRect();
  for (const peg of pegs) {
    peg.el.style.setProperty(
      "--height",
      `${diskRect.height * noOfDisks + EXTRA_PEG_HEIGHT}px`
    );
  }
}
function createDisks(noOfDisks, pegs) {
  return new Array(noOfDisks).fill(null).map((_, i) => {
    const disk = document.createElement("div");
    DISK_CONTAINER.append(disk);
    pegs[0].disks.push(disk);
    disk.innerHTML = (i + 1).toString();
    disk.setAttribute("data-disk", `${i}`);
    disk.classList.add("disk");
    disk.style.setProperty("--color", randomColor());
    let width = PEG_CONTAINER.getBoundingClientRect().width / 10;
    if (width > 50) width = 50;
    disk.style.setProperty("--width", `${width * (i + 2) * 0.4}px`);
    disk.style.setProperty(
      "--left",
      `${calcDistance(PEG_CONTAINER, pegs[0].el)}px`
    );
    disk.style.setProperty(
      "--bottom",
      `${disk.getBoundingClientRect().height * (noOfDisks - i - 1)}px`
    );
    disk.style.setProperty("--time", "0s");
    return disk;
  });
}
const createPegs = () => [
  { el: document.querySelector(`[data-peg="0"]`), disks: [] },
  { el: document.querySelector(`[data-peg="1"]`), disks: [] },
  { el: document.querySelector(`[data-peg="2"]`), disks: [] },
];
class Animator {
  static async animate(el, position) {
    el.style.setProperty("--time", `${time}s`);
    const keys = Object.keys(position);
    for (const key of keys) {
      el.style.setProperty(`--${key}`, `${position[key]}px`);
    }
    if (time !== 0) await sleep();
  }
  static async animateStep(step, disks, pegs) {
    let { n, from, to } = step;
    n = n - 1;
    const fromPeg = pegs[from];
    const toPeg = pegs[to];
    let bottom = fromPeg.el.getBoundingClientRect().height + 20;
    await Animator.animate(disks[n], { bottom });
    const left = calcDistance(PEG_CONTAINER, toPeg.el);
    await Animator.animate(disks[n], { left });
    bottom = toPeg.disks.length * disks[n].getBoundingClientRect().height;
    await Animator.animate(disks[n], { bottom });
    fromPeg.disks.pop();
    toPeg.disks.push(disks[n]);
    return true;
  }
  static anim(n, disks, pegs, curStep = 0) {
    const steps = toh(n);
    let stepCount = curStep;

    highlightCode("");

    // highlightCodeWhenNeeded("function");

    return {
      async next() {
        await highlightCodeWhenNeeded("function");
        await highlightCodeWhenNeeded("return-condition");
        await highlightCodeWhenNeeded("toh-first");

        const step = steps[stepCount];
        if (!step) {
          highlightCode("");
          return null;
        }

        if (tohCalls[0] === "move") {
          stepCount++;

          await highlightCodeWhenNeeded("move");

          await Animator.animateStep(step, disks, pegs);
        } else {
          return this.next();
        }

        await highlightCodeWhenNeeded("toh-last");

        const returnValue = steps[stepCount];
        return returnValue;
      },
      get curStep() {
        return stepCount;
      },
    };
  }
}
let noOfDisks = 1;
let stopped = false;
let animatedSteps;
RANGE.addEventListener("input", resetTime);
SELECT.addEventListener("change", restart);
RESTART.addEventListener("click", restart);
window.addEventListener("resize", debounce(restart));
PLAY_ALL.addEventListener("click", async () => {
  stopped = false;
  disableButtons(true, true);
  while (!stopped && (await animatedSteps.next())) {}
});
NEXT.addEventListener("click", async () => {
  disableButtons(true, true);
  if (await animatedSteps.next()) {
    disableButtons(false, false);
  } else if (!stopped) {
    disableButtons(true, true);
  }
});
function main() {
  const pegs = createPegs();
  DISK_CONTAINER.innerHTML = "";
  const disks = createDisks(noOfDisks, pegs);
  setPegHeight(disks[0], noOfDisks, pegs);
  animatedSteps = Animator.anim(noOfDisks, disks, pegs);
}
main();
async function restart() {
  disableButtons(false, false);
  stopped = true;
  await reset();
  noOfDisks = +SELECT.value;
  main();
}
async function reset() {
  time = 0;
  await sleep(0);
  resetTime();
}
function disableButtons(playAllButton, nextButton) {
  if (typeof playAllButton === "boolean") PLAY_ALL.disabled = playAllButton;
  if (typeof nextButton === "boolean") NEXT.disabled = nextButton;
}

async function highlightCodeWhenNeeded(section) {
  await sleep(time / 2);

  if (tohCalls[0] === section) {
    highlightCode(section);
    tohCalls.shift();
  }
}

function highlightCode(highlightSection) {
  for (const section of codeSections) {
    const el = document.querySelector(`.${section}`);

    if (highlightSection === section) {
      el.style.background = "#4f586b";
    } else {
      el.style.background = "";
    }
  }
}
