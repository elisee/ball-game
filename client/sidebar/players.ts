const playersList = document.querySelector(".sidebar .players table") as HTMLTableElement;

const teamLists: { [index: number]: HTMLTableSectionElement } = {
  0: playersList.querySelector(".team-0") as HTMLTableSectionElement,
  1: playersList.querySelector(".team-1") as HTMLTableSectionElement
};
const spectactorsList = playersList.querySelector(".spectators") as HTMLTableSectionElement;

export function add(player: Game.PlayerPub) {
  const row = document.createElement("tr");
  row.dataset["playerId"] = player.id;

  const nameCell = document.createElement("td");
  nameCell.textContent = player.name;
  nameCell.className = "name";
  row.appendChild(nameCell);

  if (player.avatar == null) {
    nameCell.colSpan = 2;
    spectactorsList.appendChild(row);
  } else {
    const scoreCell = document.createElement("td");
    scoreCell.textContent = player.avatar.score.toString();
    scoreCell.className = "score";
    row.appendChild(scoreCell);

    const teamList = teamLists[player.avatar.teamIndex];
    teamList.appendChild(row);
  }
}

export function setName(playerId: string, name: string) {
  const nameCell = playersList.querySelector(`tr[data-player-id="${playerId}"] td.name`) as HTMLTableRowElement;
  nameCell.textContent = name;
}

export function setTeam(playerId: string, teamIndex: number) {
  const row = playersList.querySelector(`tr[data-player-id="${playerId}"]`) as HTMLTableRowElement;
  row.parentElement.removeChild(row);

  const nameCell = row.querySelector("td.name") as HTMLTableCellElement;
  const scoreCell = row.querySelector("td.score") as HTMLTableCellElement;

  if (teamIndex == null) {
    if (scoreCell != null) {
      row.removeChild(scoreCell);
      nameCell.colSpan = 2;
    }
    spectactorsList.appendChild(row);
  } else {
    if (scoreCell == null) {
      nameCell.colSpan = 1;
      const scoreCell = document.createElement("td");
      scoreCell.textContent = "0";
      scoreCell.className = "score";
      row.appendChild(scoreCell);
    }

    const teamList = teamLists[teamIndex];
    teamList.appendChild(row);
  }
}

export function remove(playerId: string) {
  const row = playersList.querySelector(`tr[data-player-id="${playerId}"]`) as HTMLTableRowElement;
  row.parentElement.removeChild(row);
}

export function clearTeams() {
  for (const teamIndex in teamLists) {
    const teamList = teamLists[teamIndex];

    for (let i = 1; i < teamList.childElementCount; i++) {
      const row = playersList.children[i];
      row.parentElement.removeChild(row);
      row.removeChild(row.querySelector("td.score"));
      spectactorsList.appendChild(row);
    }
  }
}
