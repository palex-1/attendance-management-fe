import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DirectiveModule } from '../../directives/directive.module';
import { AddButtonComponent } from './add-button/add-button.component';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { FilterInputComponent } from './filter-input/filter-input.component';
import { PagebleFilterInputComponent } from './pageble-filter-input/pageble-filter-input.component';
import { FileInputUploadComponent } from './file-input-upload/file-input-upload.component';
import { ShowHideAreaComponent } from './show-hide-area/show-hide-area.component';
import { EnhancedInputComponent } from './enhanced-input/enhanced-input.component';
import { EnhancedSelectComponent } from './enhanced-select/enhanced-select.component';
import { CustomFiltersComponent } from './custom-filters/custom-filters.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { ServiceUnavailableService } from './service-unavailable/service-unavailable.service';
import { ServiceUnavailableComponent } from './service-unavailable/service-unavailable.component';
import { MonthpickerComponent } from './monthpicker/monthpicker.component';
import { UtilsModule } from 'src/app/util/utils.module';
import { CustomCollapseComponent } from './custom-collapse/custom-collapse.component';
import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';
import { CustomCardComponent } from './custom-card/custom-card.component';
import { VerticalAlignCardComponent } from './vertical-align-card/vertical-align-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    DirectiveModule,
    FormsModule,
    NgbModule,
    UtilsModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AddButtonComponent,
    CustomPaginatorComponent,
    FilterInputComponent,
    PagebleFilterInputComponent,
    FileInputUploadComponent,
    ShowHideAreaComponent,
    EnhancedInputComponent,
    EnhancedSelectComponent,
    CustomFiltersComponent,
    CustomCheckboxComponent,
    ServiceUnavailableComponent,
    MonthpickerComponent,
    CustomCollapseComponent,
    UploadFileModalComponent,
    CustomCardComponent,
    VerticalAlignCardComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AddButtonComponent,
    CustomPaginatorComponent,
    FilterInputComponent,
    PagebleFilterInputComponent,
    FileInputUploadComponent,
    ShowHideAreaComponent,
    EnhancedInputComponent,
    EnhancedSelectComponent,
    CustomFiltersComponent,
    CustomCheckboxComponent,
    ServiceUnavailableComponent,
    MonthpickerComponent,
    CustomCollapseComponent,
    UploadFileModalComponent,
    CustomCardComponent,
    VerticalAlignCardComponent
  ],
  providers: [
    ServiceUnavailableService
  ]
})
export class ComponentsModule { }
