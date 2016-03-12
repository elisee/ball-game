const status = document.querySelector(".main .status") as HTMLDivElement;

export function setText(text: string) {
  status.textContent = text;
}

export function setTimer(timer: number) {
  status.textContent = timer.toString();
}
