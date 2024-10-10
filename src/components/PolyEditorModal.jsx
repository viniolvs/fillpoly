import { useEffect, useState } from "react";
import Modal from 'react-modal';
import './PolyEditorModal.css'

const PolyEditorModal = ({ isOpen, onClose, poly, updatePoly }) => {
  const [localPoly, setLocalPoly] = useState(null);

  useEffect(() => {
    if (poly) setLocalPoly({ ...poly, points: [...poly.points] });
  }, [poly]);

  if (!localPoly) return null;

  const handleColorChange = (color, isEdge = false) => {
    const updatedPoly = { ...localPoly };

    if (isEdge) {
      updatedPoly.edgeColor = color;
    } else {
      updatedPoly.color = color
    }
    setLocalPoly(updatedPoly);
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
        <div className="colorLabelInput">
          <label>Color:</label>
          <input
            value={localPoly.color}
            type="color"
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
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
