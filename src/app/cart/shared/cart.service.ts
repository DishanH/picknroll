import { EventEmitter, Injectable } from "@angular/core";
import { Product } from "../../models/product.model";
import { CartItem } from "../../models/cart-item.model";
import { MessageService } from "../../messages/message.service";

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[];
  public itemsChanged: EventEmitter<CartItem[]> = new EventEmitter<
    CartItem[]
  >();

  constructor(private messageService: MessageService) {
    this.cartItems = [];
  }

  public getItems() {
    return this.cartItems.slice();
  }

  // Get Product ids out of CartItem[] in a new array
  private getItemIds() {
    //return this.getItems().map(cartItem => cartItem.product.id);
    return this.getItems().map((cartItem) =>
      this.getItemIdWithVariant(cartItem.product.id, cartItem.variant)
    );
  }

  private getItemIdWithVariant = (itemid: string, variant: number): string =>
    `${itemid}-${variant}`;

  public addItem(item: CartItem) {
    // If item is already in cart, add to the amount, otherwise push item into cart
    //const itemProductId = `${item.product.id}`;

    const itemProductId = this.getItemIdWithVariant(
      item.product.id,
      item.variant
    );
    if (this.getItemIds().includes(itemProductId)) {
      this.cartItems.forEach(function (cartItem) {
        if (`${cartItem.product.id}-${cartItem.variant}` === itemProductId) {
          cartItem.amount += item.amount;
        }
      });
      this.messageService.add(
        "Amount in cart changed for: " + item.product.name
      );
    } else {
      item.id = (this.cartItems?.length ?? 0) + 1;
      this.cartItems.push(item);
      this.messageService.add("Added to cart: " + item.product.name);
    }
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public addItems(items: CartItem[]) {
    items.forEach((cartItem) => {
      this.addItem(cartItem);
    });
  }

  public removeItem(item: CartItem) {
    const indexToRemove = this.cartItems.findIndex(
      (element) => element === item
    );
    this.cartItems.splice(indexToRemove, 1);
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add("Deleted from cart: " + item.product.name);
  }

  public updateItemAmount(item: CartItem, newAmount: number) {
    //const itemProductId = `${item.product.id}-${item.variant}`;
    //const itemProductId = `${item.product.id}`;
    this.cartItems.forEach((cartItem) => {
      if (cartItem.id === item.id) {
        cartItem.amount = newAmount;
      }
    });
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add("Updated amount for: " + item.product.name);
  }

  public clearCart() {
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add("Cleared cart");
  }

  public getTotal() {
    let total = 0;
    this.cartItems.forEach((cartItem) => {
      // total += cartItem.amount * cartItem.product.price;
      total +=
        cartItem.amount *
        (cartItem.variant == 1
          ? cartItem.product.price
          : cartItem.product[`variantPrice${cartItem.variant}`]);
    });
    return total;
  }
}
