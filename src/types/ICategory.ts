export interface ICategory {
  name: string;
  questions: {
    text: string;
    price: number;
    answer: string;
  }[];
}
