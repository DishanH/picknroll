import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";

import { Observable, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from "rxjs/operators";
import algoliasearch, { SearchClient, SearchIndex } from "algoliasearch";

import { ProductService } from "../../../products/shared/product.service";
import { Product } from "../../../models/product.model";
import { fromPromise } from "rxjs/internal-compatibility";
import { ProductSearchService } from "../../../products/shared/product-search.service";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  products: any[];
  term$ = new Subject<string>();
  @Input() showSearch: boolean;
  @Output() onHideSearch = new EventEmitter<boolean>();
  showMore = false;
  seachText: string;
  client: SearchClient;
  index: SearchIndex;
  showSearchResults: boolean = false;

  ALGOIA_APP_ID = environment.algolia.appId;
  ALGOIA_ADMIN_KEY = environment.algolia.adminKey; //move to env file 'expose in git'
  ALGOIA_INDEX_NAME = "Products";

  constructor(
    private productService: ProductService,
    private searchSeavice: ProductSearchService,
    private route: Router
  ) {
    this.client = algoliasearch(this.ALGOIA_APP_ID, this.ALGOIA_ADMIN_KEY);
    this.index = this.client.initIndex(this.ALGOIA_INDEX_NAME);
  }
  ngOnDestroy(): void {
    this.term$.unsubscribe();
    this.searchSeavice.term$.unsubscribe();
  }

  ngOnInit() {
    this.searchSeavice.term$
      // .pipe(
      //   debounceTime(400),
      //   distinctUntilChanged(),
      //   filter((term) => term.length > 0)
      // )
      // .subscribe((term) => {
      //   let result = this.search(term);
      //   //this.products = results.slice(0, 3);
      //   //this.showMore = results.length > 3;
      // });
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((term) => term.length > 2), //3
        switchMap((term) => this.search(term))
      )
      .subscribe((results: Product[]) => {
        this.showSearchResults = true;
        this.products = results.slice(0, 3);
        this.showMore = results.length > 3;

      });
  }

  public search(term: string) {
    // let result = this.productService.findProducts(term);
    // return result;

    const searchService = this.index
      .search(term, {
        attributesToRetrieve: ["name", "description", "imageURLs"],
      })
      .then((data) => {
        return data.hits;
      })
      .catch((err) => []);

    return fromPromise(searchService);
    //return this.productService.findProducts(term);
  }

  public onSearchInput(event) {
    let term = event.target.value;
    if (term.length > 0) {
      term = term.charAt(0).toUpperCase() + term.slice(1);
      this.term$.next(term);
      this.searchSeavice.term$.next(term);
    } else {
      this.products = [];
      this.term$.next("");
      this.searchSeavice.term$.next("");
      this.showSearchResults = false;
    }
  }

  public onClickProduct(id){
    this.route.navigate([`products/${id}`]);
    this.onCloseSearch();
  }

  public onCloseSearch() {
    // this.showSearch = false;
    this.showSearchResults = false;
    // this.onHideSearch.emit(false);
    this.products = [];
    this.term$.next("");
    this.searchSeavice.term$.next("");
    this.seachText = "";
  }

  public onEnter() {
    if (this.seachText.length > 2) {
      // this.route.navigate(["/search/"],{ queryParams: { searchText: term } });
      this.route.navigate([`/product-search/${this.seachText}`]);
      this.onCloseSearch();
    }
  }
}
