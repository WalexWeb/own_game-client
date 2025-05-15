import { ICategory } from "./ICategory";
import { ITeam } from "./ITeam";

export interface IGameSetupState {
  step: "gameName" | "categories" | "teams" | "review";
  gameName: string;
  gameId: number;
  categories: ICategory[];
  teams: ITeam[];
}
