import { atomWithStorage } from "jotai/utils";

export const gameNameAtom = atomWithStorage<string>("gameName", "");

