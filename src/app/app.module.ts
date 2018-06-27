import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TagBoxModule } from './tagbox/tagbox.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
	BrowserModule,
    TagBoxModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
