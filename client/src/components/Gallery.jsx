import React, { useState, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import Room from "./Room";
import CustomOrbitControls from "./CameraControls";
import Modal from "../pages/Modal";
import { AppContext } from "../App";
import "../App.css";

// Gallery component displaying a 3D room with paintings
const Gallery = () => {
  const [selectedArt, setSelectedArt] = useState(null); // State for the selected art
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { setFavoriteArts } = useContext(AppContext);

  // Handle painting click to open the modal with selected art details
  const handlePaintingClick = (artDetails) => {
    setSelectedArt(artDetails);
    setIsModalOpen(true);
  };

  // Close the modal and reset selected art
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArt(null);
  };

  // Handle saving the art to favorites
  const handleSave = (art) => {
    setFavoriteArts((prev) => [...prev, art]);
    console.log("Art saved:", art);
  };

  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <Canvas camera={{ position: [0, 1, 2], fov: 75 }}>
        <ambientLight intensity={0.8} color="#ffffff" />
        <pointLight position={[8, 8, 8]} intensity={100} color="#ffffff" />
        <pointLight position={[-8, 8, 8]} intensity={100} color="#ffffff" />
        <pointLight position={[8, 8, -8]} intensity={100} color="#ffffff" />
        <pointLight position={[-8, 8, -8]} intensity={60} color="#ffffff" />
        <pointLight position={[-12, 8, -8]} intensity={60} color="#ffffff" />
        <pointLight position={[-29, 8, -8]} intensity={100} color="#ffffff" />
        <pointLight position={[-29, 8, 8]} intensity={100} color="#ffffff" />
        <pointLight position={[-12, 8, 8]} intensity={60} color="#ffffff" />
        <pointLight position={[-20, 8, 0]} intensity={100} color="#ffffff" />
        <pointLight position={[0, 8, 0]} intensity={100} color="#ffffff" />

        <Room onPaintingClick={handlePaintingClick} />
        <CustomOrbitControls />
      </Canvas>

      {isModalOpen && selectedArt && (
        <Modal art={selectedArt} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
};

export default Gallery;
