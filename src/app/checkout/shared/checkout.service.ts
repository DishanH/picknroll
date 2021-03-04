import { Injectable, EventEmitter } from "@angular/core";
import { Order } from "../../models/order.model";
import { Customer } from "../../models/customer.model";
import { CartItem } from "../../models/cart-item.model";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CheckoutService {
  private orderInProgress: Order;
  public orderInProgressChanged: EventEmitter<Order> = new EventEmitter<Order>();
  public stepChanged: EventEmitter<number> = new EventEmitter<number>();
  public activeStep: number;
  public shippingFee$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {

    this.activeStep = (Number)(localStorage.getItem("12345_order_step")) ?? 0;

    if(localStorage.getItem("12345_order")){
      this.orderInProgress = JSON.parse(localStorage.getItem("12345_order")) ?? new Order(new Customer());
      this.shippingFee$.next(this.orderInProgress.shippingFee);
    }
    else
      this.orderInProgress = new Order(new Customer());

    this.orderInProgressChanged.subscribe(order => localStorage.setItem("12345_order",JSON.stringify(order)));
    this.stepChanged.subscribe(order => localStorage.setItem("12345_order_step",this.activeStep.toString()));
  }

  public gotoStep(number) {
    this.activeStep = number;
    this.stepChanged.emit(this.activeStep);
  }

  public nextStep() {
    this.activeStep++;
    this.stepChanged.emit(this.activeStep);
  }

  previousStep() {
    this.activeStep--;
    this.stepChanged.emit(this.activeStep);
  }

  public resetSteps() {
    this.activeStep = 0;
    this.stepChanged.emit(this.activeStep);
  }

  public setCustomer(customer: Customer) {
    this.orderInProgress.customer = customer;
    this.orderInProgressChanged.emit(this.orderInProgress);
  }

  public setPaymentMethod(paymentMethod: string) {
    this.orderInProgress.paymentMethod = paymentMethod;
    this.orderInProgressChanged.emit(this.orderInProgress);
  }

  public setShippingMethod(shippingMethod: string, shippingFee: number) {
    this.orderInProgress.shippingMethod = shippingMethod;
    this.orderInProgress.shippingFee = shippingFee;
    this.shippingFee$.next(shippingFee);
    this.orderInProgressChanged.emit(this.orderInProgress);
  }

  public setOrderItems(items: CartItem[]) {
    this.orderInProgress.items = items;
    this.orderInProgressChanged.emit(this.orderInProgress);
  }

  public getOrderInProgress() {
    return this.orderInProgress;
  }

  public resetOrder(){
    this.orderInProgressChanged.emit(new Order(new Customer()));
  }

}
