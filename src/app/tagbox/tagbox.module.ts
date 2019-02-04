import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';

import { TagComponent } from './components/tag.component';
import { TagBoxComponent } from './components/tagbox.component';
import { TagTransfer } from './components/tag.transfer';

@NgModule({
  imports: [
    CommonModule,
    IntoPipeModule
  ],
  declarations: [
    TagBoxComponent,
    TagComponent
  ],
  exports: [
    TagBoxComponent
  ],
  entryComponents: [
  ],
  providers: [
    TagTransfer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TagBoxModule {}
