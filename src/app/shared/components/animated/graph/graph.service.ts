import {Injectable} from '@angular/core';
import {NodeComponent} from "./node.component";
import {GraphComponent} from "./graph.component";
import {PacketComponent} from "./packet.component";

export interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rotate?: string;
}

export const renderNode = Symbol('render');

const lines: Record<string, LineProps> = {
  al2bl: {
    x1: 70,
    y1: 72,
    x2: 100,
    y2: 72,
    rotate: '',
  },
  bl2al: {
    x1: 100,
    y1: 76,
    x2: 70,
    y2: 76,
    rotate: 'rotate(180 0 0)',
  },
  at2al: {
    x1: 40,
    y1: 63,
    x2: 40,
    y2: 70,
    rotate: 'rotate(90 0 0)',
  },
  al2at: {
    x1: 60,
    y1: 70,
    x2: 60,
    y2: 63,
    rotate: 'rotate(270 0 0)',
  },
  bt2bl: {
    x1: 110,
    y1: 63,
    x2: 110,
    y2: 70,
    rotate: 'rotate(90 0 0)',
  },
  bl2bt: {
    x1: 130,
    y1: 70,
    x2: 130,
    y2: 63,
    rotate: 'rotate(270 0 0)',
  },
  aa2at: {
    x1: 40,
    y1: 48,
    x2: 40,
    y2: 55,
    rotate: 'rotate(90 0 0)',
  },
  at2aa: {
    x1: 60,
    y1: 55,
    x2: 60,
    y2: 48,
    rotate: 'rotate(270 0 0)',
  },
  ba2bt: {
    x1: 110,
    y1: 48,
    x2: 110,
    y2: 55,
    rotate: 'rotate(90 0 0)',
  },
  bt2ba: {
    x1: 130,
    y1: 55,
    x2: 130,
    y2: 48,
    rotate: 'rotate(270 0 0)',
  },
};

interface NetworkPacket {
  data: ArrayBuffer;
}

interface CPUModel {
  crc32(data: ArrayBuffer): number;
}

interface INetworkEnvironment {
  nodeMap: Map<number, NodeProps>;
  nodeNameMap: Map<string, NodeProps>;
  edgeMap: Map<number, Map<number, EdgeProps[]>>;
  hostStorage: any;
  cpu: CPUModel;

  create(len: number): Promise<NetworkPacket>;

  route(node: BuildNode<any>, hi: number, n: NetworkPacket): Promise<void>;

  drop(p: NetworkPacket): Promise<void>;
}

type BuildNodeClass = typeof BuildNode;

interface NetworkPacketIns extends NetworkPacket {
  id: number;
  [renderNode]?: PacketComponent;
}

class NetworkEnvironment implements INetworkEnvironment {
  incId: number;
  packetId: number;
  nodeMap: Map<number, NodeProps> = new Map();
  nodeNameMap: Map<string, NodeProps> = new Map();
  edgeMap: Map<number, Map<number, EdgeProps[]>> = new Map();
  component?: GraphComponent;

  // action: Map<number, (p: NetworkPacket) => void>;

  constructor(public hostStorage: any, public cpu: CPUModel) {
    this.incId = 0;
    this.packetId = 0;
    // this.action = new Map();
  }

  // spawnNode(model: BuildNodeClass, storage: any): Promise<BuildNode<any>> {
  //   return Promise.resolve(new model(this.incId++, storage));
  // }

  create(len: number): Promise<NetworkPacketIns> {
    const ins: NetworkPacketIns = {
      id: this.packetId++,
      data: new ArrayBuffer(len),
    }
    if (this.component) {
      ins[renderNode] = new PacketComponent(this.component);
    }

    return Promise.resolve(ins);
  }

  route(node: BuildNode<any>, hi: number, n: NetworkPacketIns): Promise<void> {
    const ee = this.edgeMap.get(node.prop.id);
    if (!ee) {
      throw new Error(`invalid edge ${node.prop.id} ${hi}`);
    }
    const nn = this.nodeMap.get(hi)!;
    const e = ee.get(hi);
    if (!e || !e.length) {
      throw new Error(`invalid edge ${node.prop.id} ${hi}`);
    }

    const routeAsync = () => {
      if (nn.controller) {
        return nn.controller.route([n], this);
      }
      return Promise.resolve();
    }

    if (n[renderNode]) {
      let p: PacketComponent = n[renderNode]!;
      // offsetProp: LineProps;
      const rotate0 = {x1: -4, y1: -1.5, x2: 0, y2: -1.5};
      const rotate90 = {x1: 1.5, y1: -4, x2: 1.5, y2: 0};
      const rotate180 = {x1: 4, y1: 1.5, x2: 0, y2: 1.5};
      const rotate270 = {x1: -1.5, y1: 4, x2: -1.5, y2: 0};
      let i: LineProps;
      if (!e[0].lineProp.rotate) {
        return p.forward(e[0].lineProp, rotate0, 2000).then(routeAsync);
      } else if (e[0].lineProp.rotate === 'rotate(180 0 0)') {
        return p.forward(e[0].lineProp, rotate180, 2000).then(routeAsync);
      } else if (e[0].lineProp.rotate === 'rotate(90 0 0)') {
        return p.forward(e[0].lineProp, rotate90, 500).then(routeAsync);
      } else if (e[0].lineProp.rotate === 'rotate(270 0 0)') {
        return p.forward(e[0].lineProp, rotate270, 500).then(routeAsync);
      } else {
        throw new Error('gg');
      }
    }

    return Promise.resolve();
  }

  drop(p: NetworkPacketIns): Promise<void> {
    // this.action.set(p.id, (p: NetworkPacket) => {
    //
    // });
    return Promise.resolve();
  }
}

interface NetworkModelTrait {
  nodeStorage: any;
}

class BuildNode<T extends NetworkModelTrait> {

  constructor(public prop: NodeProps, public storage: NetworkModelTrait['nodeStorage']) {
    prop.controller = this;
  }

  async route(packets: NetworkPacket[], env: INetworkEnvironment): Promise<void> {
    for (const p of packets) {
      await env.drop(p);
    }
  }
}

interface NodeProps {
  name?: string;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  title?: string;
  controller?: BuildNode<any>;
  [renderNode]?: NodeComponent;
}

interface EdgeProps {
  frId: number;
  toId: number;
  lineProp: LineProps;
  // [renderNode]: ;
}

class HostNode<T extends NetworkModelTrait> extends BuildNode<T> {
  prefix = '';

  constructor(prop: NodeProps, storage: NetworkModelTrait['nodeStorage'], prefix: string) {
    super(prop, storage);
    this.prefix = prefix;
  }

  async route(packets: NetworkPacket[], env: INetworkEnvironment): Promise<void> {
    const data = [];
    for (const p of packets) {
      data.push(env.cpu.crc32(p.data));
    }
    if (data.length) {
      console.log(this.prefix, 'application', 'receive', data);
    }
    if (Math.random() < 0.8) {
      const packet = await env.create(10);
      const b = new Uint8Array(packet.data);
      b[0] = this.prefix.codePointAt(0)!;
      if (this.prefix == 'a') {
        b[1] = 'b'.codePointAt(0)!;
      } else {
        b[1] = 'a'.codePointAt(0)!;
      }
      for (let j = 2; j < b.length; j++) {
        b[j] = '0123456789'.codePointAt(Math.floor(Math.random() * 10))!;
      }

      const transport = env.nodeNameMap.get(`${this.prefix}t`);
      if (transport) {
        return env.route(this, transport.id, packet);
      } else {
        console.log('transport not found');
      }
    }
    return Promise.resolve(undefined);
  }
}

class TransportNode<T extends NetworkModelTrait> extends BuildNode<T> {
  prefix = '';

  constructor(prop: NodeProps, storage: NetworkModelTrait['nodeStorage'], prefix: string, public routeTable: Record<string, string>) {
    super(prop, storage);
    this.prefix = prefix;
  }

  async route(packets: NetworkPacket[], env: INetworkEnvironment): Promise<void> {
    const data = [];
    for (const p of packets) {
      data.push(env.cpu.crc32(p.data));
    }
    const forwarder = (packet: NetworkPacket) => {
      const x = String.fromCharCode(...new Uint8Array(packet.data));
      if (!this.routeTable[x[1]]) {
        console.log('route target not found');
      }

      const link = env.nodeNameMap.get(this.routeTable[x[1]]);
      if (link) {
        return env.route(this, link.id, packet);
      } else {
        console.log('link not found');
      }
      return Promise.resolve();
    }
    return Promise.all(packets.map(forwarder)).then(() => undefined);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  accessMap: Map<number, BuildNode<any>>;
  nodeId = 0;
  nodes: NodeProps[] = [
    {
      name: 'al',
      id: ++this.nodeId,
      x: 30,
      y: 70,
      width: 40,
      height: 8,
      title: 'HostA::LinkLayer',
    },
    {
      name: 'bl',
      id: ++this.nodeId,
      x: 100,
      y: 70,
      width: 40,
      height: 8,
      title: 'HostB::LinkLayer',
    },
    {
      name: 'at',
      id: ++this.nodeId,
      x: 30,
      y: 55,
      width: 40,
      height: 8,
      color: 'rgba(129,199,212, 0.7)',
      title: 'HostA::TransportLayer',
    },
    {
      name: 'bt',
      id: ++this.nodeId,
      x: 100,
      y: 55,
      width: 40,
      height: 8,
      color: 'rgba(129,199,212, 0.7)',
      title: 'HostB::TransportLayer',
    },
    {
      name: 'aa',
      id: ++this.nodeId,
      x: 30,
      y: 40,
      width: 40,
      height: 8,
      color: 'rgba(235,180,113, 0.7)',
      title: 'HostA::Application',
    },
    {
      name: 'ba',
      id: ++this.nodeId,
      x: 100,
      y: 40,
      width: 40,
      height: 8,
      color: 'rgba(235,180,113, 0.7)',
      title: 'HostB::Application',
    },
  ];
  nodeMap: Map<number, NodeProps>;
  nodeNameMap: Map<string, NodeProps>;
  edgeMap: Map<number, Map<number, EdgeProps[]>>;
  env: NetworkEnvironment;

  constructor() {
    this.accessMap = new Map();
    this.nodeMap = new Map();
    this.nodeNameMap = new Map();
    this.edgeMap = new Map();
    for (const n of this.nodes) {
      this.nodeMap.set(n.id, n);
      this.nodeNameMap.set(n.name!, n);
    }
    for (const k of Object.keys(lines)) {
      const el = k.split('2');
      const u = this.nodeNameMap.get(el[0]);
      const v = this.nodeNameMap.get(el[1]);
      if (!u || !v) {
        console.error('no u or v', el[0], el[1]);
        throw new Error('...');
      }
      let linkMap = this.edgeMap.get(u.id);
      if (!linkMap) {
        linkMap = new Map();
        this.edgeMap.set(u.id, linkMap);
      }
      {
        const ref = linkMap!;
        ref.set(v.id, [
          {
            frId: u.id,
            toId: v.id,
            lineProp: lines[k],
          }
        ]);
      }
    }

    const env = new NetworkEnvironment({}, {
      crc32(data: ArrayBuffer): number {
        let res = 0;
        const view = new Uint8Array(data);
        for (let i = 0; i < data.byteLength; i += 4) {
          switch (data.byteLength-i) {
            case 1:
              res ^= view[i];
              break;
            case 2:
              res ^= (view[i+1] << 8) | view[i];
              break;
            case 3:
              res ^= (view[i+2] << 16) | (view[i+1] << 8) | view[i];
              break;
            default:
              res ^= (view[i+3] << 24) | (view[i+2] << 16) | (view[i+1] << 8) | view[i];
              break;
          }
        }
        return res;
      }
    });
    env.nodeMap = this.nodeMap;
    env.nodeNameMap = this.nodeNameMap;
    env.edgeMap = this.edgeMap;
    this.env = env;

    const ha = new HostNode(this.nodeNameMap.get('aa')!, {}, 'a');
    const hb = new HostNode(this.nodeNameMap.get('ba')!, {}, 'b');
    new TransportNode(this.nodeNameMap.get('at')!, {}, 'a', {
      'b': 'al',
      'a': 'aa',
    });
    new TransportNode(this.nodeNameMap.get('bt')!, {}, 'b', {
      'b': 'ba',
      'a': 'bl',
    });
    new TransportNode(this.nodeNameMap.get('al')!, {}, 'a', {
      'b': 'bl',
      'a': 'at',
    });
    new TransportNode(this.nodeNameMap.get('bl')!, {}, 'b', {
      'b': 'bt',
      'a': 'al',
    });

    const haSource = (h: HostNode<any>) => h.route([], env).catch(console.error).then(() => {
      return new Promise((resolve) => {
        const i = setTimeout(() => {
          clearTimeout(i);
          resolve(haSource(h));
        }, 1000);
      })
    });

    haSource(ha).catch(console.error);
    haSource(hb).catch(console.error);
  }
}
