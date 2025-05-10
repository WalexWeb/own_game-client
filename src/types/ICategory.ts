interface IQuestion {
  id: number;
  text: string;
  price: number;
  answer: string;
  isAnswered: boolean;
}

export interface ICategory {
  id: number;
  name: string;
  questions: IQuestion[];
}
