import { Category } from "./category.model";

export class Product {
  public imageFeaturedUrl?;
  public relatedProducts: Product[];
  constructor(
    public id: number = 1,
    public date: string = new Date().toISOString().split("T")[0],
    public name: string = "",
    public description: string = "",
    public price: number = 0,
    public priceNormal: number = 0,
    public reduction: number = 0,
    public imageURLs: string[] = [],
    public imageRefs: string[] = [],
    public categories: Category[] = [],
    // public categories: {} = {},
    public groupid: string = "",
    public ratings: {} = {},
    public currentRating: number = 0,
    public sale: boolean = false,
    public display: boolean = false,
    public variantsAvailable: boolean = false,
    public variantHeader: string ="",

    //product variants
    public variantId1: number = 1,
    public variantName1: string = null,
    public variantPrice1: number = 0,
    public variantPriceNormal1: number = 0,
    public variantEnabled1: boolean = true,

    public variantId2: number = 2,
    public variantName2: string = "",
    public variantPrice2: number = 0,
    public variantPriceNormal2: number = 0,
    public variantEnabled2: boolean = false,

    public variantId3: number = 3,
    public variantName3: string = "",
    public variantPrice3: number = 0,
    public variantPriceNormal3: number = 0,
    public variantEnabled3: boolean = false,

    public variantId4: number = 4,
    public variantName4: string = "",
    public variantPrice4: number = 0,
    public variantPriceNormal4: number = 0,
    public variantEnabled4: boolean = false,
  ) {}
}
