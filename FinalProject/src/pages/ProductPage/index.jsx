import React, { useState, useEffect } from "react";
import "./ProductCard.css";
// Import icons from react-icons if necessary

const ProductCard = () => {
  const [imgId, setImgId] = useState(1);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const updateDisplayWidth = () => {
      const display = document.querySelector(".img-showcase img:first-child");
      if (display) {
        setDisplayWidth(display.clientWidth);
      }
    };

    updateDisplayWidth(); // Initial call to set the width
    window.addEventListener("resize", updateDisplayWidth); // Adjust on window resize

    return () => window.removeEventListener("resize", updateDisplayWidth); // Clean up
  }, []);

  const slideImage = () => {
    // Adjust the translation based on the current image ID and display width
    const slideAmount = -(imgId - 1) * displayWidth;
    return { transform: `translateX(${slideAmount}px)` };
  };

  return (
    <div className="card-wrapper">
      {/* Card content goes here, omitted for brevity */}
      <div className="product-imgs">
        <div className="img-display">
          <div className="img-showcase" style={slideImage()}>
            {/* Your images here */}
          </div>
        </div>
        <div className="img-select">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="img-item" onClick={() => setImgId(id)}>
              <img src={""} alt={`Shoe ${id}`} />
            </div>
          ))}
        </div>
      </div>
      {/* More card content */}
    </div>
  );
};

export default ProductCard;
