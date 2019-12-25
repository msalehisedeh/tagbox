import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IntoPipeModule } from '@sedeh/into-pipes';
import { TaggerModule } from '@sedeh/tagger';

import { AppComponent } from './app.component';
import { TagBoxModule } from './tagbox/tagbox.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IntoPipeModule,
    TaggerModule,
    TagBoxModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
