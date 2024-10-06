import React from "react";
import { useState, useEffect, useRef } from "react";
import Point from "../models/Point";
import Poly from "../models/Poly";
import "./Area.css";
import PolyEditor from "./PolyEditor";

const Area = () => {
  const [isDrawing, setIsDrawing] = useState(false);
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

    if (polys.length > 0) {
      polys.forEach((poly) => {
        fillPoly(poly);
        drawEdges(poly);
      });
    }
  }, [points, polys, color, count]);

  /**
   * @param {Poly} poly
   */
  const drawEdges = (poly) => {
    ctx.beginPath();
    ctx.moveTo(poly.points[0].x, poly.points[0].y);
    for (let i = 1; i < poly.points.length; i++) {
      ctx.lineTo(poly.points[i].x, poly.points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = poly.edgeColor;
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  /**
   * @param {Poly} poly
   */
  const fillPoly = (poly) => {
  };

  function drawPixel(x, y, color) {
    ctx.lineWidth = 1
    ctx.strokeStyle = color

    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1)
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
            console.log(isDrawing);
            if (isDrawing) {
              return [...prevPoints, new Point(e.clientX, e.clientY, "#000000")];
            }
          })
        }>
      </canvas>
      <div id="list">

        <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          Fill Polys
        </h3>

        <PolyEditor polys={polys} handleDelete={handleDelete} handleColorChange={handleColorChange} />

        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <div id="controls">
            <button id="finishDrawing"
              className={points.length >= 3 ? "addPoly" : "inactive"}
              style={{ display: isDrawing ? "block" : "none" }}
              onClick={() => {
                if (points.length >= 3) {
                  const poly = new Poly(`Poly ${count}`, points.slice(), "#ffff00");
                  setCount((prevCount) => prevCount + 1);
                  setPolys((prevPolys) => [...prevPolys, poly]);
                  setPoints([])
                } else {
                  alert("You must select at least 3 points to draw a polygon")
                }
              }}
            >
              Draw
            </button>
            <button
              id="addPoly"
              onClick={() => {
                if (isDrawing) setPoints([]);
                setIsDrawing(!isDrawing)
              }}
              className={isDrawing ? "clear" : "addPoly"}
            >
              {isDrawing ? "Cancel" : "Add Polygons"}
            </button>
          </div>
          <span id="warning" style={{
            display: points.length >= 3 ? "none" : "block",
            color: "red",
            fontSize: "12px",
            flexGrow: 1,
            width: "100%"
          }}>
            {isDrawing && points.length <= 3 ? "You must select at least 3 points to draw a polygon" : ""}
          </span>
        </div>

        <button id="clear" className="clear"
          style={{ display: "block" }}
          onClick={() => {
            setPolys([]);
            setPoints([]);
            setCount(0);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Area;
