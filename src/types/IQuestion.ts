// types/IQuestion.ts
export interface IQuestion {
  id: number;
  questionText: string;
  answerText: string;
  points: number;
  answered: boolean;
  categoryId?: number;
}

// types/ICategory.ts
export interface ICategory {
  id: number;
  name: string;
  questions: IQuestion[];
}

// types/ITeam.ts
export interface ITeam {
  id: number;
  name: string;
  score: number;
}

export interface IGameSetupState {
  step: "gameName" | "categories" | "teams" | "review";
  gameName: string;
  gameId: number;
  categories: ICategory[];
  teams: ITeam[];
}

export interface ICurrentGame {
  id: number;
  name: string;
  status:
    | "not_started"
    | "active"
    | "finished"
    | "CREATED"
    | "ACTIVE"
    | "FINISHED";
  teams: ITeam[];
}
