import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { AuthService } from "../../account/shared/auth.service";
import { Product } from "../../models/product.model";
import { User } from "../../models/user.model";
import { PagerService } from "../../pager/pager.service";
import { ProductSearchService } from "../shared/product-search.service";
import { ProductService } from "../shared/product.service";
import { UiService } from "../shared/ui.service";

@Component({
  selector: "app-product-search",
  templateUrl: "./product-search.component.html",
  styleUrls: ["./product-search.component.scss"],
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  products: Product[];
  productsPaged: Product[];
  user: User;
  pager: any = {};
  productsLoading: boolean;
  currentPagingPage: number;
  searchTerm: string = "";
  // term$ = new Subject<string>();

  constructor(
    private productService: ProductService,
    private pagerService: PagerService,
    public uiService: UiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private searchSeavice: ProductSearchService
  ) {}

  ngOnInit(): void {
    // this.searchSeavice.term$
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     filter((term) => term.length > 0)
    //   )
    //   .subscribe((term: string) => {
    //     this.search(term);
    //   });

    this.authService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });
    this.uiService.currentPagingPage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((page) => {
        this.currentPagingPage = page;
      });
    // this.route.params
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((params: Params) => {
    //     this.getProducts(params["searchText"]);
    //   });
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.search(params["searchText"]);
      });
  }

  search(term: string) {
    this.productsLoading = true;
    this.productService
      .findProducts(term)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.products = <Product[]>products;
        this.setPage(this.currentPagingPage);
        this.productsLoading = false;
        this.searchTerm = term;
      });
  }

  setPage(page: number) {
    if (
      page < 1 ||
      (this.pager.totalPages != 0 && page > this.pager.totalPages)
    ) {
      return;
    }
    this.pager = this.pagerService.getPager(this.products.length, page, 8);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onEnter(event) {
    let term = event.target.value;
    if (term.length > 2) {
      term = term.charAt(0).toUpperCase() + term.slice(1);
      // this.term$.next(term);
      this.searchSeavice.term$.next(term);
    } else {
      this.products = [];
      // this.term$.next("");
      this.searchSeavice.term$.next("");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
