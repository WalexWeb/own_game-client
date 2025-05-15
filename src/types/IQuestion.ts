export interface IQuestion {
  id?: number;
  text: string;
  price: number;
  answer: string;
  is_answered?: boolean;
}
