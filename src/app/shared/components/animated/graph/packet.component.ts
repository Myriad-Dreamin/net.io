import * as d3 from "d3";
import {GraphComponent} from "./graph.component";
import {LineProps} from "./graph.service";

export class PacketComponent {
  protected color = 'rgba(235,122,119,0.7)';
  rotate = '';
  packet: d3.Selection<SVGPolygonElement, unknown, null, undefined>;

  constructor(graph: GraphComponent) {
    this.packet = graph.packets.append('polygon')
      .attr('points', '0,0 4,1.5 0,3 1,1.5')
      .attr('fill', this.color)
      .style('opacity', 0);
  }

  setRotate(rotate: string): void {
    this.rotate = rotate;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  reshape(): this {
    this.packet.attr('fill', this.color);
    return this;
  }

  protected getTransform(translate: string): string {
    if (this.rotate) {
      return `${translate},${this.rotate}`;
    }
    return translate;
  }

  transform(x: string, y: string, moveTimeout = 2000, fadeTimeout = 100): Promise<void> {
    return this.packet
      .transition().duration(0)
      .attr('transform', this.getTransform(x))
      .transition().ease(d3.easeLinear).duration(fadeTimeout)
      .style('opacity', 1)
      .transition().ease(d3.easeLinear).duration(moveTimeout)
      .attr('transform', this.getTransform(y))
      .transition().ease(d3.easeLinear).duration(fadeTimeout)
      .style('opacity', 0)
      .transition().ease(d3.easeLinear).duration(fadeTimeout)
      .end();
  }

  forward(
    line: LineProps,
    offset: LineProps,
    moveTimeout = 2000) {
    this.setRotate(line.rotate || '');
    this.reshape();
    return this.transform(
      `translate(${line.x1 + offset.x1}, ${line.y1 + offset.y1})`,
      `translate(${line.x2 + offset.x2}, ${line.y2 + offset.y2})`,
      Math.random() * moveTimeout / 3 + moveTimeout - moveTimeout / 1.5)
  }
}
