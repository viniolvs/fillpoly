import React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Point from "../models/Point";
import Poly from "../models/Poly";

const Area = () => {
  const [points, setPoints] = useState([]);
  const [polys, setPolys] = useState([]);
  const [color, setColor] = useState("#000000");
  const [count, setCount] = useState(0);

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
      const poly = new Poly(`Poly ${count}`, points.slice(), color);
      setCount((prevCount) => prevCount + 1);
      setPolys((prevPolys) => [...prevPolys, poly]);
      setPoints([])
    }
    if (polys.length > 0) {
      polys.forEach((poly) => {
        drawPoly(poly);
      });
    }
  }, [points, polys, color, count]);

  const drawPoly = (poly) => {
    ctx.beginPath();
    ctx.moveTo(poly.points[0].x, poly.points[0].y);
    ctx.lineTo(poly.points[1].x, poly.points[1].y);
    ctx.lineTo(poly.points[2].x, poly.points[2].y);
    ctx.closePath();
    ctx.strokeStyle = poly.edgeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleDelete = (polyName) => {
    setPolys((prevPolys) => prevPolys.filter((p) => p.name !== polyName));
  };

  const handleColorChange = (polyName, color) => {
    setPolys((prevPolys) =>
      prevPolys.map((poly) =>
        poly.name === polyName ? { ...poly, edgeColor: color } : poly
      )
    );
  };

  return (
    <div id="wrapper">
      <canvas id="canvas" ref={canvas}
        style={{
          width: 1000,
          height: 800,
          border: "2px solid black",
          borderLeftWidth: 2,
        }}
        onClick={(e) =>
          setPoints((prevPoints) => {
            return [...prevPoints, new Point(e.clientX, e.clientY, "#000000")];
          })
        }>
      </canvas>
      <button id="clear"
        style={{ display: "block" }}
        onClick={() => {
          setPolys([]);
          setPoints([]);
          setCount(0);
        }}
      >
        Clear
      </button>
      <ul id="polys">
        {polys.map((poly) => (
          <li key={poly.name}>
            {poly.name}
            <input
              id="color"
              value={poly.edgeColor}
              type="color"
              onChange={(e) => handleColorChange(poly.name, e.target.value)}
            />
            <button onClick={() => handleDelete(poly.name)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Area;
