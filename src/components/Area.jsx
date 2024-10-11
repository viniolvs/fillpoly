import React from "react";
import { useState, useEffect, useRef } from "react";
import Point from "../models/Point";
import Poly from "../models/Poly";
import "./Area.css";
import PolyEditorModal from "./PolyEditorModal";

const Area = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [polys, setPolys] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedPoly, setSelectedPoly] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDeleteBtns, setEditDeleteBtns] = useState({ x: 0, y: 0, visible: false });
  const [drawedPoints, setDrawedPoints] = useState([]);
  const [defaultEdgeColor, setDefaultEdgeColor] = useState("#ffff00");
  const [defaultFillColor, setDefaultFillColor] = useState("#ffff00");

  const canvas = useRef();
  let ctx = null;

  useEffect(() => {
    // dynamically assign the width and height to canvas
    const cnvs = canvas.current;
    cnvs.width = cnvs.clientWidth;
    cnvs.height = cnvs.clientHeight;
    const cnvsYmin = cnvs.getBoundingClientRect().top;
    const cnvsYmax = cnvs.getBoundingClientRect().bottom;

    // get context of the canvas
    ctx = cnvs.getContext("2d");

    if (polys.length > 0) {
      polys.forEach((poly) => {
        drawEdges(poly);
        fillPoly(poly, cnvsYmin, cnvsYmax);
      });
    }
    if (drawedPoints.length > 0) {
      drawedPoints.forEach((point) => {
        drawPoint(point)
      })
    }
  }, [points, polys, count, isModalOpen, drawedPoints]);

  const handleAreaClick = (e) => {
    if (isDrawing) {
      const point = new Point(e.clientX, e.clientY);
      setDrawedPoints((prevDrawedPoints) => [...prevDrawedPoints, point]);
      return setPoints((prevPoints) => [...prevPoints, point]);
    }

    for (let i = polys.length - 1; i >= 0; i--) {
      if (isPointInPoly(polys[i].points, e.clientX, e.clientY)) {
        setSelectedPoly(polys[i]);
        setEditDeleteBtns({ x: e.clientX, y: e.clientY, visible: true });
        return;
      }
    }
    setEditDeleteBtns({ ...editDeleteBtns, visible: false });
  }

  const drawPoint = (point) => {
    const color = "#000000"
    ctx.lineWidth = 1
    ctx.strokeStyle = color

    ctx.fillStyle = color
    ctx.fillRect(point.x, point.y, 4, 4)
  }

  const openModal = () => {
    setEditDeleteBtns({ ...editDeleteBtns, visible: false });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoly(null);
  };

  const updatePoly = (updatedPoly) => {
    setPolys((prevPolys) =>
      prevPolys.map((poly) => (poly.name === updatedPoly.name ? updatedPoly : poly))
    );
  };

  const drawLine = (p1, p2, color) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const drawEdges = (poly) => {
    ctx.beginPath();
    ctx.moveTo(poly.points[0].x, poly.points[0].y);
    for (let i = 1; i < poly.points.length; i++) {
      ctx.lineTo(poly.points[i].x, poly.points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = poly.edgeColor;
    ctx.lineWidth = 10;
    ctx.stroke();
  };

  const fillPoly = (poly, yMin, yMax) => {
    yMin = Math.floor(yMin); yMax = Math.floor(yMax);
    const scanlinesLength = yMax - yMin;
    const scanlines = [];
    for (let i = 0; i < scanlinesLength; i++) {
      scanlines.push([]);
    }
    for (let i = 0; i < poly.points.length; i++) {
      const p1 = poly.points[i];
      const nextPointIndex = i + 1 < poly.points.length ? i + 1 : 0;
      const p2 = poly.points[nextPointIndex];

      // se aresta for horizontal, não processa
      const mod = p2.y - p1.y >= 0 ? p2.y - p1.y : p1.y - p2.y;
      const isHorizontal = mod <= 0.1;
      if (isHorizontal) continue;

      let edgeYmin, edgeYmax, currentX;
      if (p1.y <= p2.y) {
        edgeYmin = p1.y
        edgeYmax = p2.y
        currentX = p1.x;
      } else {
        edgeYmin = p2.y
        edgeYmax = p1.y
        currentX = p2.x;
      }

      const m = (p2.y - p1.y) / (p2.x - p1.x);
      for (let j = edgeYmin; j < edgeYmax; j++) {
        const scanline = j - yMin;
        const intersection = new Point(currentX + (1.0 / m), j);

        scanlines[scanline].push(intersection);
        currentX = intersection.x;
      }
    }

    for (let scanline of scanlines) {
      if (scanline.length < 2) continue;
      scanline = scanline.sort((a, b) => a.x - b.x);
      for (let i = 0; i < scanline.length - 1; i += 2) {
        const p1 = scanline[i];
        const p2 = scanline[i + 1];
        drawLine(p1, p2, poly.color);
      }
    }
  };

  const handleDelete = (polyName) => {
    setPolys((prevPolys) => prevPolys.filter((p) => p.name !== polyName));
  };

  const isPointInPoly = (poly, x, y) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  return (
    <div id="wrapper">
      <div id="canvasWrapper">
        <canvas id="canvas" ref={canvas}
          onClick={handleAreaClick}>
        </canvas>

        {!isDrawing && editDeleteBtns.visible &&
          <div id="canvasPopup" style={{
            left: `${editDeleteBtns.x}px`,
            top: `${editDeleteBtns.y}px`,
          }}>
            <span> {selectedPoly.name} </span>
            <div id="editDeleteBtns">
              <button onClick={openModal}> Edit </button>
              <button className="clear" onClick={() => {
                setEditDeleteBtns({ ...editDeleteBtns, visible: false });
                handleDelete(selectedPoly.name);
              }}>
                Delete
              </button>
            </div>
          </div>
        }
        <PolyEditorModal
          isOpen={isModalOpen}
          onClose={closeModal}
          poly={selectedPoly}
          updatePoly={updatePoly}
        />
      </div>

      <div id="interface">
        <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          FillPoly
        </h3>

        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <div id="instructions">
            {polys.length > 0 && !isDrawing && <span style={{
              display: "block",
              fontSize: "14px",
              flexGrow: 1,
              width: "100%",
              marginBottom: "10px"
            }}>
              Click in a poly to edit
            </span>}

            {isDrawing && <span id="pointsCount" style={{
              display: "block",
              color: "green",
              fontSize: "14px",
              flexGrow: 1,
              width: "100%",
              marginBottom: "10px"
            }}>
              {points.length} points selected
            </span>}
            {isDrawing && points.length < 3 &&
              <span id="warning" style={{
                display: "block",
                color: "red",
                fontSize: "12px",
                flexGrow: 1,
                width: "100%",
                marginBottom: "10px"
              }}>
                You must select at least 3 points to draw a polygon.
              </span>}
          </div>
          <div id="controls">
            <button id="finishDrawing"
              className={points.length >= 3 ? "addPoly" : "inactive"}
              style={{ display: isDrawing ? "block" : "none" }}
              onClick={() => {
                if (points.length >= 3) {
                  const poly = new Poly(`Poly ${count}`, points.slice(), defaultFillColor, defaultEdgeColor);
                  setCount((prevCount) => prevCount + 1);
                  setPolys((prevPolys) => [...prevPolys, poly]);
                  setPoints([]);
                  setDrawedPoints([]);
                } else alert("You must select at least 3 points to draw a polygon");
              }}
            >
              Draw
            </button>
            <button
              id="addPoly"
              onClick={() => {
                if (isDrawing) {
                  setPoints([]);
                  setDrawedPoints([]);
                }
                setIsDrawing(!isDrawing)
              }}
              className={isDrawing ? "clear" : "addPoly"}
            >
              {isDrawing ? "Cancel" : "Add Polygons"}
            </button>
          </div>
        </div>

        {polys.length > 0 && <button id="clear" className="clear"
          style={{ display: "block" }}
          onClick={() => {
            setPolys([]);
            setPoints([]);
            setCount(0);
          }}
        >
          Clear
        </button>}

        {isDrawing &&
          <div id="defaultColors">
            <div className="colorLabelInput">
              <label>Fill Color:</label>
              <input
                value={defaultFillColor}
                type="color"
                onChange={(e) => setDefaultFillColor(e.target.value)}
              />
            </div>
            <div className="colorLabelInput">
              <label>Edge Color:</label>
              <input
                value={defaultEdgeColor}
                type="color"
                onChange={(e) => setDefaultEdgeColor(e.target.value)}
              />
            </div>
          </div>
        }
      </div>
    </div >
  );
};

export default Area;
