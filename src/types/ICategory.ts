export interface ICategory {
  id?: number;
  name: string;
  questions: {
    text: string;
    price: number;
    answer: string;
  }[];
}
