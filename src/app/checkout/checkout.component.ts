import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CartService } from '../cart/shared/cart.service';

import { CheckoutService } from './shared/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutSubscription: Subscription;
  steps: string[];
  activeStep: number;

  constructor(private checkoutService: CheckoutService, private cartService: CartService,private router: Router) {}

  ngOnInit() {
    if(this.cartService.getItems().length == 0){
      this.router.navigate(["/home"]);
    }

    this.steps = ['1. Address', '2. Shipping', '3. Payment', '4. Review'];
    this.activeStep = this.checkoutService.activeStep;
    this.checkoutSubscription = this.checkoutService.stepChanged.subscribe((step: number) => {
      this.activeStep = step;
    });
  }

  ngOnDestroy() {
    this.checkoutSubscription.unsubscribe();
  }
}
