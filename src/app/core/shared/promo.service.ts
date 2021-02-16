import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Promo } from '../../models/promo.model';

@Injectable()
export class PromoService {
  constructor(private angularFireDatabase: AngularFirestore) {}

  getPromos(): Observable<Promo[]> {
    return this.angularFireDatabase.collection<Promo>('promos').valueChanges();
  }
}
