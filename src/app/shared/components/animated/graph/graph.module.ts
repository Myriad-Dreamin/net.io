import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph.component';



@NgModule({
  declarations: [
    GraphComponent
  ],
  exports: [
    GraphComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GraphModule { }
