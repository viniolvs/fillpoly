import { useEffect, useState } from "react";
import Modal from 'react-modal';
import Poly from '../models/Poly';
import './PolyEditorModal.css'

/**
 * @param {boolean} isOpen
 * @param {Poly} poly
 */
const PolyEditorModal = ({ isOpen, onClose, poly, updatePoly }) => {
  const [localPoly, setLocalPoly] = useState(null);

  useEffect(() => {
    if (poly) setLocalPoly({ ...poly, points: [...poly.points] });
  }, [poly]);

  if (!localPoly) return null;

  const handleColorChange = (color, isEdge = false, pointIndex = null) => {
    const updatedPoly = { ...localPoly };

    if (isEdge) {
      updatedPoly.edgeColor = color;
    } else if (pointIndex !== null) {
      updatedPoly.points[pointIndex].color = color;
    }

    setLocalPoly(updatedPoly); // Atualiza o estado local com a nova cor
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}
      style={{
        content: {
          width: 'fit-content',
          height: 'fit-content',
          maxWidth: '50%',
          maxHeight: '90%',
          margin: 'auto',
          padding: '30px',
          overflow: 'auto',
          backgroundColor: '#f8f8f8',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px'
        }
      }}
    >
      <div id="modalWrapper">
        <h3>Editing {localPoly.name}</h3>
        <div className="colorLabelInput">
          <label>Edge Color:</label>
          <input
            value={localPoly.edgeColor}
            type="color"
            onChange={(e) => handleColorChange(e.target.value, true)}
          />
        </div>
        {localPoly.points.map((point, index) => (
          <div key={index} className="colorLabelInput">
            <label>Point {index}: </label>
            <input
              value={point.color}
              type="color"
              onChange={(e) => handleColorChange(e.target.value, false, index)}
            />
          </div>
        ))}
        <button onClick={() => {
          onClose();
          updatePoly(localPoly);
        }}>
          Close
        </button>
      </div>
    </Modal >
  );
};

export default PolyEditorModal;
