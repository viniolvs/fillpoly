import Modal from 'react-modal';

const PolyEditorModal = ({ isOpen, onClose, poly, handleColorChange }) => {
  if (!poly) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h3>Editing {poly.name}</h3>
      <span> Edge Color: </span>
      <input
        id="colorEdge"
        value={poly.edgeColor}
        type="color"
        onChange={(e) => handleColorChange(poly.name, "edge", e.target.value)}
      />
      {poly.points.map((point, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>Point {index}: </label>
          <input
            value={point.color}
            type="color"
            onChange={(e) => handleColorChange(poly.name, `V${index}`, e.target.value)}
          />
        </div>
      ))}
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default PolyEditorModal;
