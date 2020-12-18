import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { map, take, takeLast, takeUntil, tap } from "rxjs/operators";

import { AuthService } from "../../account/shared/auth.service";
import { PagerService } from "../../pager/pager.service";
import { ProductsCacheService } from "../shared/products-cache.service";
import { ProductService } from "../shared/product.service";
import { UiService } from "../shared/ui.service";
import { SortPipe } from "../shared/sort.pipe";

import { Product } from "../../models/product.model";
import { User } from "../../models/user.model";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-products",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  products: Product[];
  productsPaged: Product[];
  pager: any = {};
  user: User;
  productsLoading: boolean;
  currentPagingPage: number;

  constructor(
    private productService: ProductService,
    private productsCacheService: ProductsCacheService,
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    private authService: AuthService,
    public uiService: UiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.getProducts(params["category"]);
      });
  }

  getProducts(id: string) {
    this.productsLoading = true;
    this.productService
      .getProducts(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.products = <Product[]>products;
        this.setPage(this.currentPagingPage);
        this.productsLoading = false;
      });
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    console.log(page + " " + this.pager.totalPages + " " + this.products);
    if (
      page < 1 ||
      (this.pager.totalPages != 0 && page > this.pager.totalPages)
    ) {
      return;
    }
    console.log("hi");
    console.log(this.pager.startIndex);
    console.log(this.pager.endIndex);
    this.pager = this.pagerService.getPager(this.products.length, page, 4);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    console.log(this.productsPaged);
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.products,
      sortBy.replace(":reverse", ""),
      sortBy.endsWith(":reverse")
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
