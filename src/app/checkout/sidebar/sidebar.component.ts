import {
  AfterViewChecked,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CartService } from "../../cart/shared/cart.service";
import { Order } from "../../models/order.model";
import { CheckoutService } from "../shared/checkout.service";

@Component({
  selector: "app-checkout-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public cartSubtotal: number;
  public shipping: number;
  public hstAmount: number;
  public orderTotal: number;

  unsubscribe$ = new Subject();

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.cartSubtotal = this.cartService.getTotal();
    this.checkoutService.shippingFee$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((shippingFee) => {
        this.shipping = shippingFee;
        this.hstAmount = this.cartSubtotal * 0.13;
        this.orderTotal = this.cartSubtotal + this.shipping + this.hstAmount;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
