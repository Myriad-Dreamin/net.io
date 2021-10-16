import * as d3 from "d3";
import {GraphComponent} from "./graph.component";

export class NodeComponent {
  protected x = 0;
  protected y = 0;
  protected width = 10;
  protected height = 10;
  protected color = 'rgba(93, 172, 129, 0.7)';
  protected title = '';

  circle: d3.Selection<SVGRectElement, unknown, null, undefined>;
  text: d3.Selection<SVGTextElement, unknown, null, undefined>;

  constructor(graph: GraphComponent, public id: number) {
    this.circle = graph.nodes.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', this.x)
      .attr('y', this.y)
      .attr('fill', this.color);
    this.text = graph.nodes.append('text')
      .attr('x', this.x + this.width / 2)
      .attr('y', this.y + this.height / 2)
      .attr('class', 'node-text')
      .text(this.title);
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  setWidth(w: number): this {
    this.width = w;
    return this;
  }

  setHeight(w: number): this {
    this.height = w;
    return this;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  moveTo(): this {
    this.circle.attr('x', this.x).attr('y', this.y)
      .transition().duration(1);
    this.text.attr('x', this.x + this.width / 2).attr('y', this.y + this.height / 2)
      .transition().duration(1);
    return this;
  }

  reshape(): this {
    this.circle
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', this.color)
      .transition().duration(1);
    this.text
      .text(this.title)
      .transition().duration(1);
    this.text.attr('x', this.x + this.width / 2).attr('y', this.y + this.height / 2)
      .transition().duration(1);
    return this;
  }
}
