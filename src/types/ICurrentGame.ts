import { ITeam } from "./ITeam";

export interface ICurrentGame {
  id: number;
  name: string;
  status: string;
  teams: ITeam[];
}
