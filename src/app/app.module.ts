import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PropertiesComponent } from './properties/properties.component';
import { SingleRoadComponent } from './library/singleroad/singleroad.component';

@NgModule({
  declarations: [
    AppComponent,
    PropertiesComponent,
    SingleRoadComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
