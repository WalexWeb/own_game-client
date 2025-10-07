import { atomWithStorage } from "jotai/utils";
import { ICurrentGame, IGameSetupState, ITeam } from "../../types/IQuestion";

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

