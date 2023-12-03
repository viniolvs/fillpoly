import React from "react";
import { useState, useEffect, useRef } from "react";
import Point from "../models/Point";
import Poly from "../models/Poly";
import "./Area.css";

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
        fillPoly(poly);
        drawEdges(poly);
      });
    }
  }, [points, polys, color, count]);

  const drawEdges = (poly) => {
    ctx.beginPath();
    ctx.moveTo(poly.points[0].x, poly.points[0].y);
    ctx.lineTo(poly.points[1].x, poly.points[1].y);
    ctx.lineTo(poly.points[2].x, poly.points[2].y);
    ctx.closePath();
    ctx.strokeStyle = poly.edgeColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const fillPoly = (poly) => {
    poly.points.sort((a, b) => a.y - b.y);

    let v0 = poly.points[0], v1 = poly.points[1], v2 = poly.points[2]
    const v0color = hexToRgb(v0.color)
    const v1color = hexToRgb(v1.color)
    const v2color = hexToRgb(v2.color)

    const edges = [
      {
        begin: v0,
        end: v1,
        rate: ((v1.x - v0.x) / (v1.y - v0.y)),
        rateR: ((v1color.R - v0color.R) / (v1.y - v0.y)),
        rateG: ((v1color.G - v0color.G) / (v1.y - v0.y)),
        rateB: ((v1color.B - v0color.B) / (v1.y - v0.y))
      },
      {
        begin: v1,
        end: v2,
        rate: ((v2.x - v1.x) / (v2.y - v1.y)),
        rateR: ((v2color.R - v1color.R) / (v2.y - v1.y)),
        rateG: ((v2color.G - v1color.G) / (v2.y - v1.y)),
        rateB: ((v2color.B - v1color.B) / (v2.y - v1.y))
      },
      {
        begin: v2,
        end: v0,
        rate: ((v0.x - v2.x) / (v0.y - v2.y)),
        rateR: ((v0color.R - v2color.R) / (v0.y - v2.y)),
        rateG: ((v0color.G - v2color.G) / (v0.y - v2.y)),
        rateB: ((v0color.B - v2color.B) / (v0.y - v2.y))
      }
    ]

    let lastX = 0, lastColor, swaped = false
    for (let y = v0.y, i = 0; y < v1.y; y++, i++) {
      let interval = [
        edges[0].begin.x + edges[0].rate * i,
        edges[0].begin.x + edges[2].rate * i
      ]
      lastX = interval[1]
      if (interval[1] < interval[0]) {
        const aux = interval[0]
        interval[0] = interval[1]
        interval[1] = aux
        swaped = true
      }

      let color0 = {
        R: v0color.R + edges[0].rateR * i,
        G: v0color.G + edges[0].rateG * i,
        B: v0color.B + edges[0].rateB * i
      }
      let color2 = {
        R: v0color.R + edges[2].rateR * i,
        G: v0color.G + edges[2].rateG * i,
        B: v0color.B + edges[2].rateB * i
      }
      lastColor = color2

      if (swaped) {
        const aux = color0
        color0 = color2
        color2 = aux
      }

      const varX = interval[1] - interval[0]
      const delta = {
        R: (color2.R - color0.R) / varX,
        G: (color2.G - color0.G) / varX,
        B: (color2.B - color0.B) / varX
      }

      for (let j = interval[0], k = 0; j < interval[1]; j++, k++) {
        drawPixel(j, y, `rgb(${color0.R + delta.R * k}, ${color0.G + delta.G * k}, ${color0.B + delta.B * k})`)
      }
    }

    swaped = false
    for (let y = v1.y, i = 0; y < v2.y; y++, i++) {
      let interval = [edges[1].begin.x + edges[1].rate * i, lastX + edges[2].rate * i]
      if (interval[1] < interval[0]) {
        const aux = interval[0]
        interval[0] = interval[1]
        interval[1] = aux
        swaped = true
      }

      let color1 = {
        R: v1color.R + edges[1].rateR * i,
        G: v1color.G + edges[1].rateG * i,
        B: v1color.B + edges[1].rateB * i
      }
      let color2 = {
        R: lastColor.R + edges[2].rateR * i,
        G: lastColor.G + edges[2].rateG * i,
        B: lastColor.B + edges[2].rateB * i
      }
      if (swaped) {
        const aux = color1
        color1 = color2
        color2 = aux
      }

      const varX = interval[1] - interval[0]
      const delta = {
        R: (color2.R - color1.R) / varX,
        G: (color2.G - color1.G) / varX,
        B: (color2.B - color1.B) / varX
      }

      for (let j = interval[0], k = 0; j < interval[1]; j++, k++) {
        drawPixel(j, y, `rgb(${color1.R + delta.R * k}, ${color1.G + delta.G * k}, ${color1.B + delta.B * k})`)
      }
    }
  };

  function drawPixel(x, y, color) {
    ctx.lineWidth = 1
    ctx.strokeStyle = color

    ctx.fillStyle = color
    ctx.fillRect(x, y, 2, 2)
  }

  function hexToRgb(hex) {
    const R = parseInt(hex.substring(1, 3), 16);
    const G = parseInt(hex.substring(3, 5), 16);
    const B = parseInt(hex.substring(5, 7), 16);
    return { R, G, B };
  }

  const handleDelete = (polyName) => {
    setPolys((prevPolys) => prevPolys.filter((p) => p.name !== polyName));
  };

  const handleColorChange = (polyName, type, color) => {
    if (type === "edge") {
      setPolys((prevPolys) =>
        prevPolys.map((poly) => {
          if (poly.name === polyName) {
            poly.edgeColor = color;
          }
          return poly;
        })
      );
    }
    else if (type === "V0") {
      setPolys((prevPolys) =>
        prevPolys.map((poly) => {
          if (poly.name === polyName) {
            poly.points[0].color = color;
          }
          return poly;
        })
      );
    }
    else if (type === "V1") {
      setPolys((prevPolys) =>
        prevPolys.map((poly) => {
          if (poly.name === polyName) {
            poly.points[1].color = color;
          }
          return poly;
        })
      );
    }
    else if (type === "V2") {
      setPolys((prevPolys) =>
        prevPolys.map((poly) => {
          if (poly.name === polyName) {
            poly.points[2].color = color;
          }
          return poly;
        })
      );
    }
  }

  return (
    <div id="wrapper">
      <canvas id="canvas" ref={canvas}
        style={{
          width: 1250,
          height: 900,
          border: "2px solid black",
          borderLeftWidth: 2,
        }}
        onClick={(e) =>
          setPoints((prevPoints) => {
            return [...prevPoints, new Point(e.clientX, e.clientY, "#000000")];
          })
        }>
      </canvas>
      <div id="list">
        <div id="labels">
          <span>Nome</span>
          <span>Aresta</span>
          <span>V0</span>
          <span>V1</span>
          <span>V2</span>
          <span></span>
        </div>
        <div id="polys">
          {polys.map((poly) => (
            <div key={poly.name}>
              <span>{poly.name}</span>
              <input
                id="colorEdge"
                value={poly.edgeColor}
                type="color"
                onChange={(e) => handleColorChange(poly.name, "edge", e.target.value)}
              />
              <input
                id="colorV0"
                value={poly.points[0].color}
                type="color"
                onChange={(e) => handleColorChange(poly.name, "V0", e.target.value)}
              />
              <input
                id="colorV1"
                value={poly.points[1].color}
                type="color"
                onChange={(e) => handleColorChange(poly.name, "V1", e.target.value)}
              />
              <input
                id="colorV2"
                value={poly.points[2].color}
                type="color"
                onChange={(e) => handleColorChange(poly.name, "V2", e.target.value)}
              />
              <button className="delete" onClick={() => handleDelete(poly.name)}>
                Delete
              </button>
            </div>
          ))}
        </div>
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
        <div id="instructions">Clique em três pontos na área para criar um polígono</div>
      </div>
    </div>
  );
};

export default Area;
