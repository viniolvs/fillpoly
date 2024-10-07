import React, { useState } from 'react';
import "./Area.css";
import PolyEditorModal from './PolyEditorModal'; // Import the modal component

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

            <button className="clear" onClick={() => handleDelete(poly.name)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <PolyEditorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        poly={selectedPoly}
        handleColorChange={handleColorChange}
      />
    </div>
  );
};

export default PolyEditor;
