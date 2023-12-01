import React from "react";
import { useState, useEffect, useRef } from "react";
import Point from "../models/Point";

const Area = () => {
  const [points, setPoints] = useState([]);
  const [limit, setLimit] = useState(3);

  const canvas = useRef();
  let ctx = null;

  useEffect(() => {
    // dynamically assign the width and height to canvas
    const cnvs = canvas.current;
    cnvs.width = cnvs.clientWidth;
    cnvs.height = cnvs.clientHeight;

    // get context of the canvas
    ctx = cnvs.getContext("2d");
    if (points.length >= 3) {
      draw();
    }
  }, [points]);

  const draw = () => {
    for (let i = 0; i < points.length - 1; i++) {
      drawLine(points[i], points[i + 1]);
    }
    drawLine(points[points.length - 1], points[0]);
  };

  const drawLine = (point1, point2) => {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div id="area">
      <canvas ref={canvas}
        style={{
          width: 1000,
          height: 800,
          border: "2px solid black",
          borderLeftWidth: 2,
        }}
        onClick={(e) =>
          setPoints((prevPoints) => {
            if (prevPoints.length < limit) {
              return [...prevPoints, new Point(e.clientX, e.clientY, "#000000")];
            } else {
              return prevPoints;
            }
          })
        }>
      </canvas>
      <button
        style={{ display: points.length > 0 ? "block" : "none" }}
        onClick={() => {
          setPoints([]);
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default Area;
