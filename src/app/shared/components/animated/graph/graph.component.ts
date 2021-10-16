import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {AnimatedD3BaseComponent} from "../base/base.component";
import * as d3 from 'd3';
import {GraphService, LineProps, renderNode} from "./graph.service";
import {NodeComponent} from "./node.component";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent extends AnimatedD3BaseComponent implements OnInit {
  nodeId = 0;

  nodes: d3.Selection<SVGGraphicsElement, unknown, null, undefined> = (undefined as any); // Node Group
  packets: d3.Selection<SVGGraphicsElement, unknown, null, undefined> = (undefined as any); // Packet Group

  constructor(private elRef: ElementRef, private svc: GraphService) {
    super();
    this.init(elRef.nativeElement);
  }

  ngOnInit(): void {
    this.resetD3Component();
    this.nodes = this.svg.append('g');
    this.packets = this.svg.append('g');
    this.svc.env.component = this;

    const renderNodes = [];

    for (const node of this.svc.nodes) {
      const r = new NodeComponent(this, node.id)
        .setX(node.x).setY(node.y);
      renderNodes.push(r);
      if (node.width != undefined) {
        r.setWidth(node.width);
        console.log(node.width);
      }
      if (node.height != undefined) {
        r.setHeight(node.height);
      }
      if (node.color != undefined) {
        r.setColor(node.color);
      }
      if (node.title != undefined) {
        r.setTitle(node.title);
      }
      r.reshape().moveTo();
      node[renderNode] = r;
    }

    interface PacketProp {
      color?: string;
      rotate?: string;
    }

    const packetGroup = (color: string) => ([
      {
        color: color,
      },
      {
        color: color,
        rotate: 'rotate(180 0 0)',
      },
      {
        color: color,
        rotate: 'rotate(90 0 0)',
      },
      {
        color: color,
        rotate: 'rotate(270 0 0)',
      },
    ]);

    const packets: PacketProp[] = [
      ...packetGroup('rgba(235,122,119,0.7)'),
      ...packetGroup('rgba(252,159,77,0.7)'),
      ...packetGroup('rgba(155,144,194,0.7)'),
      ...packetGroup('rgba(165,222,228,0.7)'),
    ]

    // const packetNodes: PacketComponent[] = [];
    //
    // for (const p of packets) {
    //   const pn = new PacketComponent(this);
    //   packetNodes.push(pn);
    //   if (p.color) {
    //     pn.setColor(p.color);
    //   }
    //   if (p.rotate) {
    //     pn.setRotate(p.rotate);
    //   }
    //   pn.reshape();
    // }

    const repeated: (seq: (() => Promise<void>)[], off?: number) => () => Promise<void> = (seq: (() => Promise<void>)[], off: number = 0) => {
      const single = async () => {
        for (let i = off; i < seq.length; i++) {
          await seq[i]();
        }
        for (let i = 0; i < off; i++) {
          await seq[i]();
        }
      }

      const multiple: () => Promise<void> = () => single().then(() => multiple());
      return multiple;
    };

    // const forwardPacket = (packet: PacketComponent,
    //                        line: LineProps,
    //                        offset: LineProps,
    //                        moveTimeout = 2000) => {
    //   return () => packet
    //     .transform(
    //       `translate(${line.x1 + offset.x1}, ${line.y1 + offset.y1})`,
    //       `translate(${line.x2 + offset.x2}, ${line.y2 + offset.y2})`, Math.random() * moveTimeout / 3 + moveTimeout - moveTimeout / 1.5);
    // }

    // const getGroup = (off = 0) => ([
    //   // () => packetNodes[0]
    //   //   .transform(`translate(${66}, ${70.5})`, `translate(${100}, ${70.5})`),
    //   // () => packetNodes[1]
    //   //   .transform(`translate(${104}, ${77.5})`, `translate(${70}, ${77.5})`),
    //   forwardPacket(packetNodes[2 + off], lines.aa2at, rotate90, 500),
    //   forwardPacket(packetNodes[2 + off], lines.at2al, rotate90, 500),
    //   forwardPacket(packetNodes[0 + off], lines.al2bl, rotate0, 2000),
    //   forwardPacket(packetNodes[3 + off], lines.bl2bt, rotate270, 500),
    //   forwardPacket(packetNodes[3 + off], lines.bt2ba, rotate270, 500),
    //   forwardPacket(packetNodes[2 + off], lines.ba2bt, rotate90, 500),
    //   forwardPacket(packetNodes[2 + off], lines.bt2bl, rotate90, 500),
    //   forwardPacket(packetNodes[1 + off], lines.bl2al, rotate180, 2000),
    //   forwardPacket(packetNodes[3 + off], lines.al2at, rotate270, 500),
    //   forwardPacket(packetNodes[3 + off], lines.at2aa, rotate270, 500),
    // ]);
    //
    // repeated(getGroup(0))().catch(console.error);
    // repeated(getGroup(4), 5)().catch(console.error);
    // repeated(getGroup(8), 7)().catch(console.error);
    // repeated(getGroup(12), 2)().catch(console.error);
    // repeated(getGroup(8))().catch(console.error);
    // repeated(getGroup(12), 5)().catch(console.error);
    // repeated(getGroup(0), 7)().catch(console.error);
    // repeated(getGroup(4), 2)().catch(console.error);

    // .attr( "transform", `translate(${70}, ${30})`)
    const drawLine = (prop: LineProps) => this.svg.append('line')
      .attr('class', 'flow-line')
      .attr('x1', prop.x1)
      .attr('y1', prop.y1)
      .attr('x2', prop.x2)
      .attr('y2', prop.y2)
      .attr("stroke", "black")
      .attr("stroke-width", "0.2");
    this.svc.edgeMap.forEach((l) => {
      l.forEach((x) => {
        x.map((k) => drawLine(k.lineProp));
      })
    })
  }

}
