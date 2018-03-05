import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TagBoxModule } from './tagbox/tagbox.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TagBoxModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
