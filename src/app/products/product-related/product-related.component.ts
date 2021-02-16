import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-related',
  templateUrl: './product-related.component.html',
  styleUrls: ['./product-related.component.scss']
})
export class ProductRelatedComponent implements OnInit {

  @Input() public product: Product;
  constructor() { }

  ngOnInit(): void {

  }

}
