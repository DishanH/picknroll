import { Injectable, OnInit } from "@angular/core";
import { Observable, of, from as fromPromise } from "rxjs";
import { switchMap } from "rxjs/operators";
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireDatabase } from "@angular/fire/database";

import { Order } from "../../../models/order.model";

import { MessageService } from "../../../messages/message.service";
import { AuthService } from "../../shared/auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { firestore } from "firebase";
import { CartItem } from "../../../models/cart-item.model";

@Injectable()
export class OrderService {
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private store: AngularFireDatabase,
    private fireStoreDb: AngularFirestore
  ) {}

  public getOrders() {
    return this.authService.user.pipe(
      switchMap((user) => {
        if (user) {
          const remoteUserOrders = `/users/${user.uid}/orders`;
          return this.fireStoreDb
            .collection("users")
            .doc(user.uid.toString())
            .collection("orders")
            .valueChanges();
          // return this.store.list(remoteUserOrders).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public addUserOrder(order: Order, total: number, user: string) {
    var orderItems = order.items;
    order.items = null;
    const orderWithMetaData = {
      ...order,
      ...this.constructOrderMetaData(order),
      total,
    };
    var orderCollection = this.fireStoreDb
      .collection("users")
      .doc(user)
      .collection("orders");

    const databaseOperation = orderCollection
      .doc(orderWithMetaData.number)
      .set(orderWithMetaData)
      .then(
        (response) => {
          //Add items
          this.addOrderItems(
            orderCollection,
            orderWithMetaData.number,
            orderItems
          );
          return response;
        },
        (error) => error
      );

    // const databaseOperation = this.store
    //   .list(`users/${user}/orders`)
    //   .push(orderWithMetaData)
    //   .then((response) => response, (error) => error);

    return fromPromise(databaseOperation);
  }
  public addAnonymousOrder(order: Order, total: number) {
    var orderItems = order.items;
    order.items = null;
    const orderWithMetaData = {
      ...order,
      ...this.constructOrderMetaData(order),
      total,
    };

    var orderCollection = this.fireStoreDb.collection("orders");

    const databaseOperation =orderCollection
      .doc(orderWithMetaData.number)
      .set({ ...orderWithMetaData })
      .then(
        (response) => {
          this.addOrderItems(
            orderCollection,
            orderWithMetaData.number,
            orderItems
          );
          return response;
        },
        (error) => error
      );

    // const databaseOperation = this.store
    //   .list('orders')
    //   .push(orderWithMetaData)
    //   .then((response) => response, (error) => error);

    return fromPromise(databaseOperation);
  }

  public addOrderItems(
    orderCol: AngularFirestoreCollection,
    docNumber: string,
    carItems: CartItem[]
  ) {
    carItems.forEach((element) => {
      const databaseOperation = orderCol
        .doc(docNumber)
        .update({
          items: firestore.FieldValue.arrayUnion({...element}),
        })
        .then(
          (response) => {
            //Add items
            return response;
          },
          (error) => {
            console.log(error);
            return error;
          }
        );
    });
  }

  private constructOrderMetaData(order: Order) {
    return {
      number: (Math.random() * 10000000000).toString().split(".")[0],
      date: new Date().toString(),
      status: "In Progress",
    };
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.addError(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
