import { atomWithStorage } from "jotai/utils";

interface IQuestion {
  id: number;
  text: string;
  price: number;
  answer: string;
  isAnswered: boolean;
}

interface ICategory {
  id: number;
  name: string;
  questions: IQuestion[];
}

export const gameNameAtom = atomWithStorage<string>("gameName", "");

export const startTextAtom = atomWithStorage<boolean>("startText", true);

export const categoriesAtom = atomWithStorage<ICategory[]>("categories", []);
