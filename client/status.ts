const status = document.querySelector(".main .status") as HTMLDivElement;

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
