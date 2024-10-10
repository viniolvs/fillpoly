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

  function hexToRgb(hex) {
    const R = parseInt(hex.substring(1, 3), 16);
    const G = parseInt(hex.substring(3, 5), 16);
    const B = parseInt(hex.substring(5, 7), 16);
    return { R, G, B };
  }

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
          <div id="editDeleteBtns" style={{
            position: "absolute",
            left: `${editDeleteBtns.x}px`,
            top: `${editDeleteBtns.y}px`,
            display: "flex",
            flexDirection: "row"
          }}
          >
            <button onClick={openModal}
            >
              Edit
            </button>
            <button className="clear" onClick={() => {
              setEditDeleteBtns({ ...editDeleteBtns, visible: false });
              handleDelete(selectedPoly.name);
            }}
            >
              Delete
            </button>
          </div>
        }
        <PolyEditorModal
          isOpen={isModalOpen}
          onClose={closeModal}
          poly={selectedPoly}
          updatePoly={updatePoly}
        />
      </div>

      <div id="list">
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
                  const poly = new Poly(`Poly ${count}`, points.slice(), "#ffff00");
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
      </div>
    </div>
  );
};

export default Area;
