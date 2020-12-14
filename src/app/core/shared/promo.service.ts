import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Promo } from "../../models/promo.model";
import { filter,map } from "rxjs/operators";

@Injectable()
export class PromoService {
  jsonUrl = "../../../assets/data/demo_data.json";

  constructor(
    private angularFireDatabase: AngularFireDatabase,
    private http: HttpClient
  ) {}

  getPromos(): Observable<Promo[]> {
    return this.http.get(this.jsonUrl)
    .pipe(
      map(data => (data['promos']))
    );
    return this.angularFireDatabase.list<Promo>("promos").valueChanges();
  }
}
// export class PromoService {
//   constructor(private angularFireDatabase: AngularFireDatabase) {}

//   getPromos(): Observable<Promo[]> {
//     return this.angularFireDatabase.list<Promo>('promos').valueChanges();
//   }
// }
