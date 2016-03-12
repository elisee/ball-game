import { socket } from "../gameClient";

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
