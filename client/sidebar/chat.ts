import { socket } from "../gameClient";
import * as notifications from "../notifications";

const chatLog = document.querySelector(".sidebar .log") as HTMLDivElement;
const chatInput = document.querySelector(".sidebar textarea") as HTMLTextAreaElement;

export function setupInput(disabled: boolean) {
  chatInput.disabled = disabled;
}

export function append(author: string, text: string) {
  const div = document.createElement("div");

  const authorSpan = document.createElement("span");
  authorSpan.className = "author";
  authorSpan.textContent = `${author}: `;
  div.appendChild(authorSpan);

  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  div.appendChild(textSpan);

  chatLog.appendChild(div);
  chatLog.scrollTop = 9e9;

  notifications.show(`${author}: ${text}`);
}

export function appendInfo(text: string, notify: boolean) {
  const div = document.createElement("div");
  div.className = "info";
  div.textContent = text;

  chatLog.appendChild(div);
  chatLog.scrollTop = 9e9;

  if (notify) notifications.show(text);
}

chatInput.addEventListener("keydown", onKeyDown);

function onKeyDown(event: KeyboardEvent) {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();

    const text = chatInput.value.trim();
    chatInput.value = "";

    if (text.length > 0) socket.emit("chat", text, onChatMessageCallback);
  }
}

const onChatMessageCallback: Game.ErrorCallback = (err) => {
  if (err != null) { alert(`Could not send message: ${err}`); }
};
