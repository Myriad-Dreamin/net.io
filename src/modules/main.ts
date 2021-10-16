// interface NetworkPacket {
//   data: ArrayBuffer;
// }
//
// interface CPUModel {
//   crc32(data: ArrayBuffer): number;
// }
//
// interface INetworkEnvironment {
//   hostStorage: any;
//   cpu: CPUModel;
//
//   create(): Promise<NetworkPacket>;
//   drop(p: NetworkPacket): Promise<void>;
// }
//
// type BuildNodeClass = typeof BuildNode;
//
// interface NetworkPacketIns extends NetworkPacket {
//   id: number;
// }
//
// class NetworkEnvironment implements INetworkEnvironment {
//   incId: number;
//   packetId: number;
//   action: Map<number, (p: NetworkPacket) => void>;
//
//   constructor(public hostStorage: any, public cpu: CPUModel) {
//     this.incId = 0;
//     this.packetId = 0;
//     this.action = new Map();
//   }
//
//   spawnNode(model: BuildNodeClass, storage: any): Promise<BuildNode<any>> {
//     return Promise.resolve(new model(this.incId++, storage));
//   }
//
//   create(): Promise<NetworkPacketIns> {
//     return Promise.resolve({
//       id: this.packetId++,
//       data: new ArrayBuffer(0),
//     });
//   }
//
//   drop(p: NetworkPacketIns): Promise<void> {
//     this.action.set(p.id, (p: NetworkPacket) => {
//
//     });
//   }
// }
//
// interface NetworkModelTrait {
//   nodeStorage: any;
// }
//
// class BuildNode<T extends NetworkModelTrait> {
//
//   constructor(public id: number, public storage: NetworkModelTrait['nodeStorage']) {
//   }
//
//   async route(packets: NetworkPacket[], env: INetworkEnvironment): Promise<void> {
//     for (const p of packets) {
//       await env.drop(p);
//     }
//   }
// }
//
// class HostNode<T extends NetworkModelTrait> extends BuildNode<T> {
//   route(packets: NetworkPacket[], env: INetworkEnvironment): Promise<void> {
//     const data = [];
//     for (const p of packets) {
//       data.push(env.cpu.crc32(p.data));
//     }
//     console.log('receive', data);
//     return Promise.resolve(undefined);
//   }
// }
//
// class WorldDriver<T extends NetworkModelTrait=any> {
//   worldResolve: () => void;
//   worldReject: () => void;
//
//   nodes: BuildNode<T>[];
//
//   constructor() {
//     this.worldResolve = () => undefined;
//     this.worldReject = () => undefined;
//     this.nodes = [];
//   }
//
//   async drive(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       let ticker: number | undefined = setInterval(() => {
//         console.log('world tick');
//       }, 1000);
//
//       this.worldResolve = () => {
//         if (ticker) {
//           clearInterval(ticker);
//           ticker = undefined;
//         }
//         resolve();
//       };
//       this.worldReject = () => {
//         if (ticker) {
//           clearInterval(ticker);
//           ticker = undefined;
//         }
//         reject();
//       };
//
//     });
//   }
// }
//
// function main(): Promise<void> {
//   const wd = new WorldDriver();
//   const hostA = new HostNode();
//
//   return wd.drive();
// }
//
// main().catch(console.error)
