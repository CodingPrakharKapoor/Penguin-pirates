import React, { useRef, useState, useEffect } from "react";

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("#000000");
    const [nodes, setNodes] = useState([]);
    const [mode, setMode] = useState("write");

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 50;
        canvas.height = window.innerHeight - 150;
    }, []);

    const startDrawing = (e) => {
        if (mode !== "write") return;
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setLastX(offsetX);
        setLastY(offsetY);
    };

    const draw = (e) => {
        if (!isDrawing || mode !== "write") return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setLastX(offsetX);
        setLastY(offsetY);
    };

    const stopDrawing = () => {
        if (mode === "write") setIsDrawing(false);
    };

    const addNode = (e) => {
        if (mode !== "node") return;
        const { offsetX, offsetY } = e.nativeEvent;
        setNodes((prev) => [
            ...prev,
            { x: offsetX, y: offsetY, id: Date.now(), text: "Node" },
        ]);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "50px",
                paddingLeft: "50px",
            }}
        >
            <div>
                <button onClick={() => setMode("write")}>Write Mode</button>
                <button onClick={() => setMode("node")}>Node Mode</button>
                <button onClick={clearCanvas}>Clear Canvas</button>
                <br />
                {mode === "write" && (
                    <>
                        <label>
                            Brush Size:
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={lineWidth}
                                onChange={(e) => setLineWidth(e.target.value)}
                            />
                        </label>
                        <label>
                            Brush Color:
                            <input
                                type="color"
                                value={lineColor}
                                onChange={(e) => setLineColor(e.target.value)}
                            />
                        </label>
                    </>
                )}
            </div>
            <canvas
                ref={canvasRef}
                style={{
                    border: "2px solid black",
                    cursor: mode === "write" ? "crosshair" : "pointer",
                }}
                onMouseDown={mode === "write" ? startDrawing : addNode}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            {nodes.map((node) => (
                <div
                    key={node.id}
                    style={{
                        position: "absolute",
                        left: node.x,
                        top: node.y,
                        background: "lightblue",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "grab",
                    }}
                    draggable
                    onDragEnd={(e) => {
                        const updatedNodes = nodes.map((n) =>
                            n.id === node.id
                                ? {
                                      ...n,
                                      x: e.pageX - canvasRef.current.offsetLeft,
                                      y: e.pageY - canvasRef.current.offsetTop,
                                  }
                                : n
                        );
                        setNodes(updatedNodes);
                    }}
                >
                    {node.text}
                </div>
            ))}
        </div>
    );
};

export default Whiteboard;
