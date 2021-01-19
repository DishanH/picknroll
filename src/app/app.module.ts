// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireStorageModule } from 'angularfire2/storage';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";

// Components
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFirestoreModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(),
    CoreModule,
    ProductsModule,
    CheckoutModule,
    AccountModule,
    AdminModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
