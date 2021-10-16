import {Component, Input} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-animated-component-d3-base',
  template: '<svg></svg>'
})
export abstract class AnimatedD3BaseComponent {
  @Input() changeVersion = 0;
  @Input() transitionTime = 0;
  @Input() viewPortHeight = 100;
  @Input() viewPortWidth = 200;
  @Input() colorPalette = ['#2ea9df', '#86c166'];

  hostElement: SVGElement = (undefined as any);

  svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = (undefined as any); // Top level SVG element
  colorScale: d3.ScaleOrdinal<string, string> = (undefined as any); // D3 color provider

  init(hostElement: any): void {
    this.hostElement = hostElement;
  }

  resetD3Component(): boolean {
    this.removeSvg();
    if (!this.svg) {
      this.createSvg();
      this.setColorScale();
      return true;
    }
    return false;
  }

  protected createSvg(): void {
    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.viewPortWidth} ${this.viewPortHeight}`);
  }

  protected removeSvg(): void {
    d3.select(this.hostElement).select('svg').remove();
    this.svg = (undefined as any);
  }

  protected setColorScale(): void {
    this.colorScale = d3.scaleOrdinal(this.colorPalette);
  }
}
