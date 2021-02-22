import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Product } from "../../models/product.model";

@Component({
  selector: "app-price",
  templateUrl: "./price.component.html",
  styleUrls: ["./price.component.scss"],
})
export class PriceComponent implements OnChanges {

  @Input() public product: Product;
  @Input() public variant: number = 1;

  public price: number = 0;
  public priceNormal: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.price = this.variant ==  1 ? this.product.price : this.product[`variantPrice${this.variant}`];
    this.priceNormal = this.variant ==  1 ? this.product.priceNormal :this.product[`variantPriceNormal${this.variant}`];
  }
}
