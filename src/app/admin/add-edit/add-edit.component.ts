import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable, Subscription, of, Subject } from "rxjs";

import { MessageService } from "../../messages/message.service";
import { FileUploadService } from "../../products/shared/file-upload.service";
import { ProductService } from "../../products/shared/product.service";
import { ProductsCacheService } from "../../products/shared/products-cache.service";

import { Product } from "../../models/product.model";
import { map, takeUntil } from "rxjs/operators";
import { Category } from "../../models/category.model";

import { IDropdownSettings } from "ng-multiselect-dropdown";

// we send and receive categories as {key:true},
// but for the input field we need
// a product with categories of type string
// export class DomainProduct extends Product {
//   categories: string;
// }

// export class CategoryForDropDown {
//   constructor(public item_id: number, public item_text: string) {}
// }

@Component({
  selector: "app-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrls: ["./add-edit.component.scss"],
})
export class AddEditComponent implements OnInit, OnDestroy {
  private productSubscription: Subscription;
  private formSubscription: Subscription;
  @ViewChild("photos", { static: true }) photos;
  public productForm: FormGroup;
  public product: Product; //DomainProduct;
  public mode: "edit" | "add";
  public id;
  public percentage: Observable<number>;
  public unsubscribe$ = new Subject();

  public productCategories: Category[] = [];

  public nameForVariant: string;
  public priceForVariant: number;
  public priceNormalForVariant: number;

  // dropdownList: Category[] = [];
  // selectedItems : Category[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private productService: ProductService,
    public fileUploadService: FileUploadService,
    private productsCacheService: ProductsCacheService,
    private log: MessageService
  ) {
  }

  ngOnInit(): void {
    // this.dropdownList.push(new CategoryForDropDown(1,"a"));
    // this.productCategories.push(new CategoryForDropDown(1, "b"));
      // new CategoryForDropDown(1,"a")
      // { item_id: 1, item_text: "Mumbai" },
      // { item_id: 2, item_text: "Bangaluru" },
      // { item_id: 3, item_text: "Pune" },
      // { item_id: 4, item_text: "Navsari" },
      // { item_id: 5, item_text: "New Delhi" },
    //];
    // this.selectedItems = [{ id: 2, name: 'cat2',enabled:true }];
      // { item_id: 4, item_text: 'Navsari' }


    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.getCategories();
    this.setProduct();
  }

  private initForm() {
    this.productForm = new FormGroup({
      name: new FormControl(
        this.product && this.product.name,
        Validators.required
      ),
      id: new FormControl(
        {
          value: this.product && this.product.id,
          disabled: true,
        },
        [Validators.required, Validators.min(0)]
      ),
      date: new FormControl(
        this.product && this.product.date,
        Validators.required
      ),
      categories: new FormControl(
        this.product && this.product.categories
        // Validators.required
      ),
      groupid: new FormControl(this.product && this.product.groupid),
      description: new FormControl(
        this.product && this.product.description,
        Validators.required
      ),
      price: new FormControl(this.product && this.product.price, [
        Validators.required,
        Validators.min(0),
      ]),
      priceNormal: new FormControl(this.product && this.product.priceNormal, [
        Validators.required,
        Validators.min(0),
      ]),
      //variants

      variantHeader: new FormControl(this.product && this.product.variantHeader),

      variantName1: new FormControl(this.product && this.product.variantName1),
      variantPrice1: new FormControl({value : this.product && this.product.variantPrice1, disabled:true}),
      variantPriceNormal1: new FormControl({value : this.product && this.product.variantPriceNormal1, disabled:true}),
      variantEnabled1: new FormControl(this.product && this.product.variantEnabled1),

      variantName2: new FormControl(this.product && this.product.variantName2),
      variantPrice2: new FormControl(this.product && this.product.variantPrice2),
      variantPriceNormal2: new FormControl(this.product && this.product.variantPriceNormal2),
      variantEnabled2: new FormControl(this.product && this.product.variantEnabled2),

      variantName3: new FormControl(this.product && this.product.variantName3),
      variantPrice3: new FormControl(this.product && this.product.variantPrice3),
      variantPriceNormal3: new FormControl(this.product && this.product.variantPriceNormal3),
      variantEnabled3: new FormControl(this.product && this.product.variantEnabled3),

      variantName4: new FormControl(this.product && this.product.variantName4),
      variantPrice4: new FormControl(this.product && this.product.variantPrice4),
      variantPriceNormal4: new FormControl(this.product && this.product.variantPriceNormal4),
      variantEnabled4: new FormControl(this.product && this.product.variantEnabled4),
    });
    this.onFormChanges();
  }

  private getCategories() {
    this.productService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (categories) => {
          this.productCategories = categories;
          // categories?.forEach((a) => {
          //   this.productCategories =
          // });
        },
        (err) => console.error(err)
      );
  }

  private setProduct() {
    this.route.params.subscribe((params: Params) => {
      this.id = +this.route.snapshot.paramMap.get("id");
      // if we have an id, we're in edit mode
      if (this.id) {
        this.mode = "edit";
        this.getProduct(this.id);
        this.initForm();
      } else {
        // else we are in add mode
        this.mode = "add";
        this.constructProduct();
        this.initForm();
      }
    });
  }

  private constructProduct() {
    const product = this.constructMockProduct();
    //product.categories = this.categoriesFromObjectToString(product.categories);
    this.syncProduct(product);
    this.initForm();
  }

  private getProduct(id): void {
    this.productSubscription = this.productService
      .getProduct(id)
      .subscribe((product) => {
        if (product) {
          //product.categories = this.categoriesFromObjectToString(product.categories);
          this.syncProduct(product);
          this.initForm();
        }
      });
  }

  private onFormChanges() {
    this.formSubscription = this.productForm.valueChanges.subscribe(
      (formFieldValues) => {
        const product = { ...this.product, ...formFieldValues };
        this.syncProduct(product);
      }
    );
  }

  private syncProduct(product): void {
    const id = this.createId(product);
    const imageURLs = this.handleImageURLs(product);
    const reduction = this.calculateReduction(
      product.priceNormal,
      product.price
    );
    const sale = this.checkForSale(reduction);

    const variantsAvailable = this.checkVariants(product);

    this.product = {
      ...product,
      sale,
      reduction,
      id,
      imageURLs,
      variantsAvailable
    };
  }

  private checkVariants(product: Product): boolean {
    if(product.variantEnabled2 || product.variantEnabled3 || product.variantEnabled4)
      return true;
    return false;
  }

  public onSubmit() {
    this.syncProduct({ ...this.product, ...this.productForm.value });
    const productToSubmit = this.constructProductToSubmit(this.product);
    const files: FileList = this.photos.nativeElement.files;
    if (this.mode === "add" && files.length > 0) {
      this.addProduct(productToSubmit, files);
    } else if (this.mode === "edit") {
      this.updateProduct(productToSubmit, files);
    } else {
      this.log.addError("Please provide a file for your product");
      return;
    }
  }

  private addProduct(product: Product, files: FileList) {
    this.productService.addProduct({ product, files }).subscribe(
      (savedProduct: Product) => {
        if (savedProduct.id) {
          this.product = null;
          //this.router.navigate(['/products']);
          this.setProduct();
        }
      },
      (error) => {
        this.log.addError("Could not upload your product");
        return of(error);
      }
    );
  }

  private updateProduct(product: Product, files?: FileList) {
    this.productSubscription.unsubscribe();
    this.productService.updateProduct({ product, files }).subscribe(
      (response: Product) => {
        this.router.navigate(["/products/" + response.id]);
      },
      (error) => this.log.addError("Could not update your product")
    );
  }

  public onDelete() {
    if (this.mode === "edit") {
      this.productSubscription.unsubscribe();
      this.productService.deleteProduct(this.product).then((res) => {
        this.router.navigate(["/products"]);
      });
    } else {
      this.log.addError(`Cannot delete new product`);
    }
  }

  // pure helper functions start here:
  private constructMockProduct() {
    return new Product();
  }

  private constructProductToSubmit(product: Product): Product {
    return {
      ...product,
      //categories: this.categoriesFromStringToObject(product.categories),
      variantName1: this.product.variantName1 ?? this.product.name,
      variantPrice1:this.product.price,
      variantPriceNormal1:this.product.priceNormal
    };
  }

  private createId(product: Product): number {
    const randomId = Math.floor(Math.random() * new Date().getTime());
    let id = product.id || randomId;
    if (id === 1) {
      id = randomId;
    }
    return id;
  }

  private categoriesFromObjectToString(categories: {}): string | null {
    // categories: { key: true, key: true} || {}
    // if (Object.keys(categories).length === 0) {
    //   return 'example, category';
    // }
    return Object.keys(categories).reduce(
      (result, currentProduct, index, inputArray) => {
        if (index < inputArray.length - 1) {
          return result + currentProduct + ",";
        }
        return result + currentProduct;
      },
      ""
    );
  }

  private categoriesFromStringToObject(categories: string): {} {
    // categories: 'cat1, cat2, cat3' || ''
    if (categories.length === 0) {
      return {};
    }
    return categories
      .split(",")
      .reduce((combinedCategories, currentCategory) => {
        combinedCategories[currentCategory.trim()] = true;
        return combinedCategories;
      }, {});
  }

  private checkForSale(reduction: number): boolean {
    return reduction > 0;
  }

  private calculateReduction(priceNormal: number, price: number): number {
    const reduction = Math.round(((priceNormal - price) / priceNormal) * 100);
    return reduction > 0 ? reduction : 0;
  }

  private handleImageURLs(product: Product): string[] {
    if (product.imageURLs && product.imageURLs.length > 0) {
      return product.imageURLs;
    }
    return [];
  }

  onItemSelect(item: any) {
    console.log("onItemSelect", item);
  }
  onSelectAll(items: any) {
    console.log("onSelectAll", items);
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
