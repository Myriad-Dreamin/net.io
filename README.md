# net.io

Visual Network Model

## Use Case

### Computer Network Visualization

### Control Flow Visualization

### User Defined Trace Flow

## Concept

There are two layer in the architecture of the network graph model. The rendering layer (view of MVVM) handles HTML elements and control them according to the requirement of controller layer. The (network node) controller layer (view model of MVVM) provides the data to the rendering layer and node-by-node data operation api for user.

## Rendering Layer

### NodeComponent

The `NodeComponent` renders the nodes of the controller layer as graphical nodes in the page.

### EdgeComponent

The `EdgeComponent` renders the node relationships of the controller layer as graphical paths in the page.

### FlowComponent

The `FlowComponent` visualizes node events from one node to another node along the graphical path rendered by the `EdgeComponent`.

### GraphTopologyEngine

With the number of node and edge components increased, the topology of the graph becomes incomprehensible. The `NodeComponent` and `EdgeComponent` never decide how to make visualization comprehensible. Instead, the `GraphTopologyEngine` tries its best to render node and edge combinations.

## Controller Layer

### NetworkNode

The `NetworkNode` provides the inheritable method `route` to make packet routing decision (`NetworkFlow`): consume or forward packets with the help of `NetworkEnvironment`.

### NetworkFlow

The `NetworkFlow` considers `NetworkNode` communication abstraction, in short passing data to `NetworkNode` and the rendering layer.
