import React, { useState, useEffect, useRef } from "react";
import "./Cart.css"; // Make sure you have this CSS file
import useFirebaseImages from "../../FireBase/ImageContext";
import { imagedb } from "../../FireBase/Config";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, handleDelete }) => {
  let [quantity, setQuantity] = React.useState(item.quantity);

  const handleDecreaseQty = async () => {
    await setQuantity(quantity - 1);
    const data = { key: item.product_id, quantity: --quantity, flag: "update" };
    UpdateDatabase(data);
    if (quantity < 1) {
      handleDelete(item.product_id);
    }
  };

  const handleIncreaseQty = async () => {
    await setQuantity(quantity + 1);
    const data = { key: item.product_id, quantity: ++quantity, flag: "update" };
    UpdateDatabase(data);
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <span className="cart-item-title">{item.name}</span>
        <span className="cart-item-price">Price: ₪{item.price}</span>
        <div className="cart-item-quantity">
          <button onClick={handleDecreaseQty}>-</button>
          <input type="number" value={quantity} readOnly />
          <button onClick={handleIncreaseQty}>+</button>
        </div>
      </div>
    </div>
  );
};

async function UpdateDatabase(data) {
  try {
    const response = await fetch("http://localhost:3002/cart", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const data_json = response.json();
  } catch (error) {
    console.log(error);
  }
}

const Cart = () => {
  const imageUrls = useFirebaseImages("uploads"); // Use the hook to fetch image URLs from the 'uploads' folder in Firebase Storage
  const [products, setProducts] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [imgUrl1, setImgUrl1] = useState([]);

  const navigate = useNavigate();

  const handleDelete = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.product_id !== productId)
    );
  };
  const toastBC = useRef(null);

  useEffect(() => {
    listAll(ref(imagedb, "candles")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          const name = val.name;
          setImgUrl((prevUrls) => [...prevUrls, { name, url }]);
        });
      });
    });
  }, []);

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
      console.log(urls);
      setImgUrl1(urls);
    };

    fetchImages();
  }, []);

  const itemsWithImages = products.map((item) => {
    const imageInfo =
      imgUrl.find((img) => img.name === `p${item.id}.PNG`) ||
      imgUrl1.find((img) => img.name === `p${item.id}.jpeg`);
    console.log(imageInfo);
    return {
      ...item,
      image: imageInfo ? imageInfo.url : "default-image-url.jpg",
    };
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3002/cart", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrder = async () => {
    try {
      const response = await fetch("http://localhost:3002/cartToOrder", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to process order");
      }

      // Process response data if needed
      toastBC.current.show({
        severity: "success",
        summary: "Order Accepted",
        detail: "Your order has been successfully accepted.",
        // Your toast configuration remains the same
      });

      navigate("/paymentPage"); // Use the correct path for your app
    } catch (error) {
      console.error(error);
      toastBC.current.show({
        severity: "error",
        summary: "Order Failed",
        detail: "There was a problem processing your order.",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPrice = itemsWithImages.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items">
        {itemsWithImages.map((item) => (
          <CartItem key={item.id} item={item} handleDelete={handleDelete} />
        ))}
      </div>
      <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
      <Toast ref={toastBC} />
      <button className="cart-checkout-btn" onClick={handleOrder}>
        Pay
      </button>
    </div>
  );
};

export default Cart;
