import { atomWithStorage } from "jotai/utils";
import { ITeam } from "../../types/ITeam";
import { ICategory } from "../../types/ICategory";

export const gameNameAtom = atomWithStorage<string>("gameName", "");

export const startTextAtom = atomWithStorage<boolean>("startText", true);

export const categoriesAtom = atomWithStorage<ICategory[]>("categories", []);

export const teamsAtom = atomWithStorage<ITeam[]>("teams", []);
