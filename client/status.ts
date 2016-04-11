const status = document.querySelector(".main .status") as HTMLDivElement;
const scores = document.querySelector(".main .scores") as HTMLDivElement;
const redScoreSpan = scores.querySelector(".red") as HTMLSpanElement;
const blueScoreSpan = scores.querySelector(".blue") as HTMLSpanElement;

export function setText(text: string) {
  status.textContent = text;
}

export function setTimer(timer: number) {
  const totalSeconds = Math.floor(timer / 20);

  let seconds = (totalSeconds % 60).toString();
  if (seconds.length === 1) seconds = `0${seconds}`;
  const minutes = Math.floor(totalSeconds / 60).toString();

  status.textContent = `${minutes}:${seconds}`;
}

export function setScores(redScore: number, blueScore: number) {
  redScoreSpan.textContent = redScore.toString();
  blueScoreSpan.textContent = blueScore.toString();
}

export function clearScores() {
  scores.hidden = true;
}
