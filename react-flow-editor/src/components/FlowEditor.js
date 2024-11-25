import React, { useState, useCallback } from "react";
import Whiteboard from "./Whiteboard";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
    style: { width: 150, height: 60 },
  },
  {
    id: "2",
    position: { x: 200, y: 150 },
    data: { label: "Process" },
    style: { width: 150, height: 60 },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeSize, setNewNodeSize] = useState({ width: 150, height: 60 });
  const [newNodePosition, setNewNodePosition] = useState(null);
  const [isNodeCreationOpen, setIsNodeCreationOpen] = useState(false);
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleWhiteboard = () => {
    setShowWhiteBoard((prev) => !prev);
  };

  const handleAddNode = () => {
    if (newNodeLabel && newNodePosition) {
      const newNode = {
        id: `${nodes.length + 1}`,
        position: newNodePosition,
        data: { label: newNodeLabel },
        style: { width: newNodeSize.width, height: newNodeSize.height },
      };
      setNodes((nodes) => [...nodes, newNode]);
      setIsNodeCreationOpen(false);
    } else {
      alert("Please provide a label and position for the node");
    }
  };

  const handleCanvasClick = (event) => {
    const bounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    setNewNodePosition(position);
    setIsNodeCreationOpen(true);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <button onClick={toggleWhiteboard}>
          {showWhiteBoard ? "Switch to Flow Editor" : "Use Whiteboard"}
        </button>
      </div>

      {showWhiteBoard ? (
        <Whiteboard />
      ) : (
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            onClick={handleCanvasClick}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>

          {isNodeCreationOpen && newNodePosition && (
            <div
              style={{
                position: "absolute",
                top: `${newNodePosition.y}px`,
                left: `${newNodePosition.x}px`,
                padding: "20px",
                backgroundColor: "#f8f8f8",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
              }}
            >
              <div>
                <label>
                  Node Name:
                  <input
                    type="text"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Enter Node Name"
                  />
                </label>
              </div>
              <div>
                <label>
                  Width:
                  <input
                    type="number"
                    value={newNodeSize.width}
                    onChange={(e) =>
                      setNewNodeSize({
                        ...newNodeSize,
                        width: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </label>
              </div>
              <div>
                <label>
                  Height:
                  <input
                    type="number"
                    value={newNodeSize.height}
                    onChange={(e) =>
                      setNewNodeSize({
                        ...newNodeSize,
                        height: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </label>
              </div>
              <div>
                <button onClick={handleAddNode}>Add Node</button>
                <button onClick={() => setIsNodeCreationOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
