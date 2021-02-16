import { NgModule } from '@angular/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    declarations: [
        AddEditComponent
    ],
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ProductsModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    exports: [
        SharedModule,
        ProductsModule
    ]
})
export class AdminModule {}
