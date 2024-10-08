import { useEffect, useState } from "react";
import Modal from 'react-modal';
import Poly from '../models/Poly';

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

  const handleClose = () => {
    onClose();
    updatePoly(localPoly);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h3>Editing {localPoly.name}</h3>
      <span> Edge Color: </span>
      <input
        id="colorEdge"
        value={localPoly.edgeColor}
        type="color"
        onChange={(e) => handleColorChange(e.target.value, true)}
      />
      {localPoly.points.map((point, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>Point {index}: </label>
          <input
            value={point.color}
            type="color"
            onChange={(e) => handleColorChange(e.target.value, false, index)}
          />
        </div>
      ))}
      <button onClick={handleClose}>Close</button>
    </Modal>
  );
};

export default PolyEditorModal;
