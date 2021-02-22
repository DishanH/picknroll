import {
  combineLatest as observableCombineLatest,
  Observable,
  from as fromPromise,
  of,
} from "rxjs";
import { Injectable } from "@angular/core";

import {
  catchError,
  tap,
  switchMap,
  map,
  flatMap,
  mergeMap,
} from "rxjs/operators";

// import { AngularFireDatabase } from 'angularfire2/database';
//  import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "../../account/shared/auth.service";
import { FileUploadService } from "./file-upload.service";
import { MessageService } from "../../messages/message.service";
import { ProductRatingService } from "./product-rating.service";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

import { Product } from "../../models/product.model";
import { ProductsUrl } from "./productsUrl";
import { firestore } from "firebase";
import { Category } from "../../models/category.model";

import * as _ from "lodash";

@Injectable()
export class ProductService {
  private productsUrl = ProductsUrl.productsUrl;
  private productCollectionRef: AngularFirestoreCollection<Product>;
  private productCategoriesCollectionRef: AngularFirestoreCollection<Category>;

  constructor(
    private messageService: MessageService,
    // private db: AngularFireDatabase,
    public authService: AuthService,
    private uploadService: FileUploadService,
    private productRatingService: ProductRatingService,
    private fireStoreDb: AngularFirestore
  ) {
    this.productCollectionRef = this.fireStoreDb.collection("products");
    this.productCategoriesCollectionRef = this.fireStoreDb.collection(
      "categories"
    );
  }

  /** Log a ProductService message with the MessageService */
  private log(message: string) {
    this.messageService.add("ProductService: " + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getCategories(): Observable<Category[]> {
    return this.productCategoriesCollectionRef.valueChanges().pipe(
      map((arr) => <Category[]>arr.reverse()),
      catchError(this.handleError<Category[]>(`getCategories`))
    );
  }

  public getProducts(
    category: string = "all",
    categoryid: number = 0
  ): Observable<Product[]> {
    let result: AngularFirestoreCollection;

    if (categoryid > 0) {
      const categoryObject = { id: 4, name: _.capitalize(category) };
      result = this.fireStoreDb.collection("products", (queryfn) =>
        queryfn.where("categories", "array-contains", categoryObject)
      );
    } else {
      result = this.fireStoreDb.collection("products");
    }
    return result.valueChanges().pipe(
      map((arr) => <Product[]>arr.reverse()),
      catchError(this.handleError<Product[]>(`getProducts`))
    );
    // return this.db
    //   .list<Product>("products", (ref) => ref.orderByChild("date"))
    //   .valueChanges()
    //   .pipe(
    //     map((arr) => arr.reverse()),
    //     catchError(this.handleError<Product[]>(`getProducts`))
    //   );
  }

  public getProductsQuery(
    byChild: string,
    equalTo: string | boolean,
    limitToFirst: number
  ): Observable<Product[]> {
    return (
      this.fireStoreDb
        .collection<Product>("products", (ref) =>
          ref.orderBy(byChild).limit(limitToFirst)
        )
        //.list<Product>("products", (ref) =>
        //  ref.orderByChild(byChild).equalTo(equalTo).limitToFirst(limitToFirst)
        //)
        .valueChanges()
        .pipe(catchError(this.handleError<Product[]>(`getProductsQuery`)))
    );
  }

  public findProducts(term): Observable<any> {
    return this.fireStoreDb
      .collection<Product>(
        "products",
        (ref) =>
          // ref
          //   .orderBy("name")
          //   .startAt(term)
          //   .endAt(term + "\uf8ff")
          ref.where("name",">=",term)
        // .orderByChild("name")
        // .startAt(term)
        // .endAt(term + "\uf8ff")
      )
      .valueChanges()
      .pipe(catchError(this.handleError<Product[]>(`getProductsQuery`)));
  }

  public getProductsByDate(limitToLast: number): Observable<Product[]> {
    return this.fireStoreDb
      .collection<Product>("products", (ref) =>
        ref.orderBy("date").limitToLast(limitToLast)
      )
      .valueChanges()
      .pipe(
        map((arr) => arr.reverse()),
        catchError(this.handleError<Product[]>(`getProductsByDate`))
      );
  }

  public getProductsByRating(limitToLast: number): Observable<Product[]> {
    return this.fireStoreDb
      .collection<Product>("products", (ref) =>
        ref.orderBy("currentRating").limitToLast(limitToLast)
      )
      .valueChanges()
      .pipe(
        map((arr) => arr.reverse()),
        catchError(this.handleError<Product[]>(`getProductsByRating`))
      );
  }

  public getProductsByCategory(
    category: string,
    limitToLast: number
  ): Observable<Product[]> {
    return this.fireStoreDb
      .collection<Product>("products", (ref) =>
        ref
          .orderBy(`categories/${category}`)
          //.equalTo(true)
          .limitToLast(limitToLast)
      )
      .valueChanges()
      .pipe(
        map((arr) => arr.reverse()),
        catchError(this.handleError<Product[]>(`getProductsByCategory`))
      );
  }

  public getFeaturedProducts(): Observable<any[]> {
    return this.fireStoreDb
      .collection<Product>("featured")
      .snapshotChanges()
      .pipe(
        switchMap(
          (actions) => {
            return observableCombineLatest(
              actions.map((action) => {
                var product$ = this.getProduct(action.payload.doc.id);
                return product$;
              })
            );
          },
          (actionsFromSource, resolvedProducts) => {
            resolvedProducts.map((product, i) => {
              //product["imageFeaturedUrl"] = actionsFromSource[i].payload.val().imageFeaturedUrl;
              product["imageFeaturedUrl"] = actionsFromSource[
                i
              ].payload.doc.data().imageFeaturedUrl;
              return product;
            });
            return resolvedProducts;
          }
        ),
        catchError(this.handleError<Product[]>(`getFeaturedProducts`))
      );
  }
  public getRelatedProducts(groupid: string): Observable<Product[]> {
    var products = this.fireStoreDb.collection("products", (queryFn) => {
      return queryFn.where("groupid", "==", groupid);
    });
    return products.valueChanges().pipe(
      map((arr) => <Product[]>arr),
      catchError(this.handleError<Product[]>(`getRelatedProducts`))
    );
  }

  public getProduct(id: any): Observable<Product | null> {
    const url = `${this.productsUrl}/${id}`;
    return (
      this.fireStoreDb
        .doc<Product>(url)
        //.doc<Product>(id)
        .valueChanges()
        .pipe(
          tap((result) => {
            //console.log(result)
            if (result) {
              return of(result);
            } else {
              this.messageService.addError(`Found no Product with id=${id}`);
              return of(null);
            }
          }),
          mergeMap((result) => {
            if (result && result?.groupid) {
              return this.getRelatedProducts(result.groupid).pipe(
                map((res2) => {
                  result.relatedProducts = res2;
                  return result;
                })
              );
            } else {
              return of(result);
            }
          }),
          catchError(this.handleError<Product>(`getProduct id=${id}`))
        )
    );
    // return this.db
    //   .object<Product>(url)
    //   .valueChanges()
    //   .pipe(
    //     tap((result) => {
    //       if (result) {
    //         return of(result);
    //       } else {
    //         this.messageService.addError(`Found no Product with id=${id}`);
    //         return of(null);
    //       }
    //     }),
    //     catchError(this.handleError<Product>(`getProduct id=${id}`))
    //   );
  }

  public updateProduct(data: { product: Product; files: FileList }) {
    const url = `${this.productsUrl}/${data.product.id}`;

    if (!data.files.length) {
      return this.updateProductWithoutNewImage(data.product, url);
    }

    const dbOperation = this.uploadService
      .startUpload(data)
      .then((task) => {
        data.product.imageURLs[0] = task.downloadURL;
        data.product.imageRefs[0] = task.ref.fullPath;

        return data;
      })
      .then((dataWithImagePath) => {
        return this.fireStoreDb
          .collection("products")
          .doc(data.product.id.toString())
          .set(data.product);
        //return this.db.object<Product>(url).update(data.product);
      })
      .then((response) => {
        this.log(`Updated Product ${data.product.name}`);
        return data.product;
      })
      .catch((error) => {
        this.handleError(error);
        return error;
      });
    return fromPromise(dbOperation);
  }

  private updateProductWithoutNewImage(product: Product, url: string) {
    const dbOperation =
      //this.db.object<Product>(url).update(product)
      this.fireStoreDb
        .collection("products")
        .doc(product.id.toString())
        .set(product)
        .then((response) => {
          this.log(`Updated Product ${product.name}`);
          return product;
        })
        .catch((error) => {
          this.handleError(error);
          return error;
        });
    return fromPromise(dbOperation);
  }

  public addProduct(data: { product: Product; files: FileList }) {
    const dbOperation = this.uploadService
      .startUpload(data)
      .then(
        async (task) => {
          data.product.imageURLs.push(await task.ref.getDownloadURL());
          data.product.imageRefs.push(task.ref.fullPath);

          //console.log(data);
          //firestore test
          return this.fireStoreDb
            .collection("products")
            .doc(data.product.id.toString())
            .set(data.product);

          //return this.db
          //  .list("products")
          //  .set(data.product.id.toString(), data.product);
        },
        (error) => error
      )
      .then((response) => {
        this.log(`Added Product ${data.product.name}`);
        return data.product;
      })
      .catch((error) => {
        this.messageService.addError(
          `Add Failed, Product ${data.product.name}`
        );
        this.handleError(error);
        return error;
      });
    return fromPromise(dbOperation);
  }

  public deleteProduct(product: Product) {
    const url = `${this.productsUrl}/${product.id}`;

    this.uploadService.deleteFile(product.imageRefs);

    return (
      this.fireStoreDb
        .collection("products")
        .doc(`${product.id}`)
        .delete()
        //.object<Product>(url)
        //.remove()
        .then(() => this.log("success deleting" + product.name))
        .catch((error) => {
          this.messageService.addError("Delete failed " + product.name);
          this.handleError("delete product");
        })
    );
  }
}
