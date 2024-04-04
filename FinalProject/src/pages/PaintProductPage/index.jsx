import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { imagedb } from "../../FireBase/Config.js";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import "./style.css";

function PaintProduct() {
  const [products, setProducts] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imgs = await listAll(ref(imagedb, "handwritingPaints"));
      const urlPromises = imgs.items.map((val) =>
        getDownloadURL(val).then((url) => ({
          name: val.name,
          url,
        }))
      );
      const urls = await Promise.all(urlPromises);
      setImgUrl(urls);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3002/paints");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        // Optionally, handle the error in UI
      }
    };

    fetchProducts();
  }, []);

  async function addToCart(item) {
    try {
      console.log("add to cart");
      const response = await fetch("http://localhost:3002/AddProductToCart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item,
        }),
      });
      const data_json = response.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="row row-cols-1 row-cols-md-5 g-4">
      {products &&
        products.map((item) => {
          let id = item.id;
          const imageName = `p${id}.jpeg`;
          const image = imgUrl.find((img) => img.name === imageName);
          return (
            <div className="col" key={item.id}>
              <div className="card h-50" style={{ width: "80" }}>
                <img
                  src={image ? image.url : "/path/to/default/image.jpeg"}
                  alt={item.name}
                  className="card-img-top"
                  style={{ width: "100%", height: "300px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">₪ {item.price}</small>
                  <div className="underButton">
                    <button
                      type="button"
                      className="productCardButton"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default PaintProduct;
