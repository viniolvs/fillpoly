import React, { useState } from 'react';
import Modal from 'react-modal';

// Configure o Modal para acessar a tela de leitura
Modal.setAppElement('#root');

const PolyEditor = ({ polys, handleColorChange, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoly, setSelectedPoly] = useState(null);

  const openModal = (poly) => {
    setSelectedPoly(poly);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoly(null);
  };

  return (
    <div id="polyEditor">
      <div id="polys" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {polys.map((poly) => (
          <div key={poly.name} style={{ display: "flex", alignItems: "center", justifyContent: "start", gap: "10px" }}>
            <span>{poly.name}</span>

            <button onClick={() => openModal(poly)} style={{ marginLeft: "10px" }}>
              Edit
            </button>

            <button className="delete" onClick={() => handleDelete(poly.name)} style={{ background: "red", color: "white" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedPoly && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          <h3>Editing {selectedPoly.name}</h3>
          <span> Edge Color: </span>
          <input
            id="colorEdge"
            value={selectedPoly.edgeColor}
            type="color"
            onChange={(e) => handleColorChange(selectedPoly.name, "edge", e.target.value)}
          />
          {selectedPoly.points.map((point, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>Point {index}: </label>
              <input
                value={point.color}
                type="color"
                onChange={(e) => handleColorChange(selectedPoly.name, `V${index}`, e.target.value)}
              />
            </div>
          ))}
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default PolyEditor;
