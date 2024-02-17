import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {IntoPipeModule } from '@sedeh/into-pipes';
import { TaggerModule } from '@sedeh/tagger';
import { TagBoxModule } from '@sedeh/tagbox';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IntoPipeModule,
    TaggerModule,
    TagBoxModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
