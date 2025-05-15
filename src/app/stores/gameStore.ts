import { atomWithStorage } from "jotai/utils";
import { ITeam } from "../../types/ITeam";
import { IGameSetupState } from "../../types/IGameSetup";
import { ICurrentGame } from "../../types/ICurrentGame";

export const currentGameAtom = atomWithStorage<ICurrentGame>("currentGame", {
  id: 0,
  name: "",
  status: "not_started",
  teams: [],
});

export const startTextAtom = atomWithStorage<boolean>("startText", true);

export const teamsAtom = atomWithStorage<ITeam[]>("teams", []);

export const gameSetupAtom = atomWithStorage<IGameSetupState>("gameSetup", {
  step: "gameName",
  gameName: "",
  gameId: 0,
  categories: [],
  teams: [],
});

