import { Product } from "./product.model";

export class CartItem {
  public id: number;
  constructor(
    public product: Product,
    public variant: number,
    public amount: number
  ) {}
}
