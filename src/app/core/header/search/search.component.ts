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

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit,OnDestroy {
  products: any[];
  term$ = new Subject<string>();
  @Input() showSearch: boolean;
  @Output() onHideSearch = new EventEmitter<boolean>();
  showMore = false;
  seachText: string;
  client: SearchClient;
  index: SearchIndex;

  ALGOIA_APP_ID = "SM1DRLA1F9";
  ALGOIA_ADMIN_KEY = "24e3f1697200e6fd3e6f55cb29bd030c";//move to env file 'expose in git'
  ALGOIA_INDEX_NAME = "Products";

  constructor(private productService: ProductService) {
    this.client = algoliasearch(this.ALGOIA_APP_ID, this.ALGOIA_ADMIN_KEY);
    this.index = this.client.initIndex(this.ALGOIA_INDEX_NAME);
  }
  ngOnDestroy(): void {
    this.term$.unsubscribe();
  }

  ngOnInit() {
    this.term$
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
      filter((term) => term.length > 2),//3
      switchMap((term) => this.search(term))
    )
    .subscribe((results :Product[]) => {
      this.products = results.slice(0, 3);
      this.showMore = results.length > 3;
    });
  }

  public search(term: string) {
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
    } else {
      this.products = [];
      this.term$.next("");
    }
  }

  public onCloseSearch() {
    // this.showSearch = false;
    // this.onHideSearch.emit(false);
    this.products = [];
    this.term$.next("");
    this.seachText = "";
  }
}
