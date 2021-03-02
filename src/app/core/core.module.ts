import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxSiemaModule } from 'ngx-siema';

import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { NavigationOffCanvasComponent } from './navigation-off-canvas/navigation-off-canvas.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FooterComponent } from './content/footer/footer.component';
import { NavigationMainComponent } from './header/navigation-main/navigation-main.component';
import { ToolbarCartComponent } from './header/toolbar/cart/cart.component';
import { ToolbarProfieComponent } from "./header/toolbar/profie/profie.component";
import { HomeComponent } from './home/home.component';
import { MainSliderComponent } from './home/main-slider/main-slider.component';
import { ProductWidgetComponent } from './home/product-widget/product-widget.component';
import { PromoComponent } from './home/promo/promo.component';
import { SearchComponent } from './header/search/search.component';

import { ProductService } from '../products/shared/product.service';
import { MessageService } from '../messages/message.service';
import { CartService } from '../cart/shared/cart.service';
import { CartCachingService } from '../cart/shared/cart-caching.service';
import { PagerService } from '../pager/pager.service';
import { OrderService } from '../account/orders/shared/order.service';
import { CheckoutService } from '../checkout/shared/checkout.service';
import { AuthService } from '../account/shared/auth.service';
import { OffcanvasService } from './shared/offcanvas.service';
import { PromoService } from './shared/promo.service';
import { UiService } from '../products/shared/ui.service';
import { ProductsCacheService } from '../products/shared/products-cache.service';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        ContentComponent,
        HeaderComponent,
        NavigationOffCanvasComponent,
        TopBarComponent,
        FooterComponent,
        NavigationMainComponent,
        ToolbarCartComponent,
        ToolbarProfieComponent,
        HomeComponent,
        MainSliderComponent,
        ProductWidgetComponent,
        PromoComponent,
        SearchComponent,
        ModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgxSiemaModule.forRoot(),
        NgbModule
    ],
    exports: [
        CommonModule,
        SharedModule,
        NavigationOffCanvasComponent,
        NavigationMainComponent,
        TopBarComponent,
        HeaderComponent,
        ContentComponent,
        ModalComponent
    ],
    providers: [
        ProductService,
        ProductsCacheService,
        MessageService,
        CartService,
        CartCachingService,
        PagerService,
        OrderService,
        CheckoutService,
        AuthService,
        OffcanvasService,
        PromoService,
        UiService
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
