import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GraphModule} from "./shared/components/animated/graph/graph.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GraphModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
