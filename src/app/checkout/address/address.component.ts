import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from '../../account/shared/auth.service';
import { CheckoutService } from '../shared/checkout.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  @Input() public user;
  public formAddress: FormGroup;
  public countries: string[];

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initFormGroup();

    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.initFormGroup();
      }
    });
  }

  private initFormGroup() {
    const currentOrder = this.checkoutService.getOrderInProgress();

    let firstName = this.user && this.user.firstName;
    let lastName = this.user && this.user.lastName;
    let address1 = null;
    let address2 = null;
    let zip = null;
    let city = null;
    let email = this.user && this.user.email;
    let phone = null;
    let company = null;
    if(currentOrder){
      firstName = currentOrder.customer.firstname;
      lastName = currentOrder.customer.lastname;
      address1 = currentOrder.customer.address1;
      address2 = currentOrder.customer.address2;
      zip = currentOrder.customer.zip;
      city = currentOrder.customer.city;
      email = currentOrder.customer.email;
      phone = currentOrder.customer.phone;
      company = currentOrder.customer.company;
    }
    this.countries = ['Canada'];
    this.formAddress = new FormGroup({
      firstname: new FormControl(
        firstName,
        Validators.required
      ),
      lastname: new FormControl(
        lastName,
        Validators.required
      ),
      address1: new FormControl(address1, Validators.required),
      address2: new FormControl(address2),
      zip: new FormControl(zip, [
        Validators.required,
        Validators.pattern('[0-9a-zA-Z]{6}')
      ]),
      city: new FormControl(city, Validators.required),
      email: new FormControl(
        email,
        Validators.email
      ),
      phone: new FormControl(phone),
      company: new FormControl(company),
      country: new FormControl({ value: this.countries[0], disabled: false })
    });
  }

  public onContinue() {
    this.checkoutService.setCustomer(this.formAddress.value);
    this.checkoutService.nextStep();
  }

  // Debug: Fill Form Helper MEthod
  public onFillForm(event: Event) {
    event.preventDefault();
    this.formAddress.setValue({
      firstname: 'Hans',
      lastname: 'Muster',
      address1: 'Freeman terrace',
      address2: '',
      zip: 'l5m6r2',
      city: 'mississuga',
      email: 'dishan@outlook.com',
      phone: '+41791234567',
      company: '',
      country: 'Canada'
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
