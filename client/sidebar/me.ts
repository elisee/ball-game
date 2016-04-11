import { socket } from "../gameClient";

// Me
const nameInput = document.querySelector(".sidebar .me .name") as HTMLInputElement;
const teamSelect = document.querySelector(".sidebar .me .team") as HTMLSelectElement;

let nameInputDisabled = !nameInput.disabled;
let teamSelectDisabled = !teamSelect.disabled;

let waitingForNameInputAck = false;
let waitingForTeamSelectAck = false;

export function setupName(name: string, disabled: boolean) {
  nameInput.value = name;

  nameInputDisabled = disabled;
  nameInput.disabled = waitingForNameInputAck || nameInputDisabled;
}

export function setupTeam(teamIndex: number, disabled: boolean) {
  teamSelect.value = teamIndex != null ? teamIndex.toString() : "";

  teamSelectDisabled = disabled;
  teamSelect.disabled = waitingForTeamSelectAck || teamSelectDisabled;
}

nameInput.addEventListener("change", onChangeName);
teamSelect.addEventListener("change", onChangeTeam);

function onChangeName(event: Event) {
  event.preventDefault();

  setName(nameInput.value);
}

export function setName(name: string) {
  nameInput.value = name;
  socket.emit("setName", name, onChangeNameCallback);
  nameInput.disabled = true;
  waitingForNameInputAck = true;
}


const onChangeNameCallback: Game.ErrorCallback = (err) => {
  waitingForNameInputAck = false;
  nameInput.disabled = nameInputDisabled;

  if (err != null) { alert(`Could not set name: ${err}`); return; }
  localStorage["playerName"] = nameInput.value;
};

function onChangeTeam(event: Event) {
  event.preventDefault();
  if (teamSelect.value === "") return;

  socket.emit("joinTeam", parseInt(teamSelect.value, 10), onJoinTeamCallback);
  teamSelect.disabled = true;
  waitingForTeamSelectAck = true;
}

const onJoinTeamCallback: Game.ErrorCallback = (err) => {
  waitingForTeamSelectAck = false;
  teamSelect.disabled = teamSelectDisabled;

  if (err != null) { alert(`Could not join team: ${err}`); return; }
};
