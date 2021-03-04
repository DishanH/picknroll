import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CheckoutService } from "../shared/checkout.service";
import { Customer } from "../../models/customer.model";

@Component({
  selector: "app-checkout-shipping",
  templateUrl: "./shipping.component.html",
  styleUrls: ["./shipping.component.scss"],
})
export class ShippingComponent implements OnInit {
  public formShipping: FormGroup;
  public shippingMethods: {
    method: string;
    time: string;
    fee: number;
    value: string;
  }[];

  public shippingFee:number;

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.shippingMethods = [
      {
        method: "Canada Post Priority",
        time: "1 - 2 days",
        fee: 11,
        value: "priority",
      },
      {
        method: "Canada Post Economy",
        time: "up to one week",
        fee: 9,
        value: "economy",
      },
    ];

    //this.shippingFee = this.shippingMethods[1].fee;

    const selectedShippingMethod = this.checkoutService.getOrderInProgress()?.shippingMethod;
    this.shippingFee = this.checkoutService.getOrderInProgress()?.shippingFee ?? this.shippingMethods[1].fee;

    this.formShipping = new FormGroup({
      shippingMethod: new FormControl(
        selectedShippingMethod ?? this.shippingMethods[1].value,
        Validators.required
      ),
    });
  }

  public onBack() {
    this.checkoutService.previousStep();
  }

  public changeVal(shippingFee: number){
    this.shippingFee = shippingFee;
  }

  public onContinue() {
    this.checkoutService.setShippingMethod(
      this.formShipping.controls.shippingMethod.value,
      this.shippingFee
    );
    this.checkoutService.nextStep();
  }
}
