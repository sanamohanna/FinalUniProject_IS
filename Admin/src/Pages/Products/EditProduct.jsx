import React from "react";
import { useState, useEffect } from "react";
import { Table } from "./TableP";
import { UPDATEModal } from "./ModalUpdateP";
import { ModalAdd } from "./ModalAddP";
import { productService } from "./ProductService";
import { imagedb } from "../../FireBase/Config.js";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
function EditProduct() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [Prows, setRows] = useState([]);
  const [currentProductId, setcurrentProductId] = useState(null); 
  const [imgUrlC, setImgUrlC] = useState([]);
  const [imgUrlP, setImgUrlP] = useState([]);

  useEffect(() => {
    productService
      .getProduct()
      .then((data) => {
        console.log("Fetched data:", data); // Check the actual structure of the fetched data
        setRows(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setRows([]); 
      });
  }, []);
  useEffect(() => {
    listAll(ref(imagedb, "candles")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          const name = val.name;
          setImgUrlC((prevUrls) => [...prevUrls, { name, url }]);
        });
      });
    });
  }, []);
  useEffect(() => {
    listAll(ref(imagedb, "handwritingPaints")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          const name = val.name;
          setImgUrlP((prevUrls) => [...prevUrls, { name, url }]);
        });
      });
    });
  }, []);
  
  const [rowToEdit, setRowToEdit] = useState(null);
  const handleAddProduct = (productData) => {
  
    setRows([...Prows, productData]);
  };
  const handleDeleteRow = (targetIndex) => {
    const newProducts = Prows.filter((Prows) => Prows.id !== targetIndex);
    setRows(newProducts);
    fetch(`http://localhost:3002/DeleteProducts/${targetIndex}`, {
      method: "DELETE", // Use DELETE method
      headers: {
        "Content-Type": "application/json",
      },
      // No body needed for a DELETE request
    })
      .then((response) => {
        if (!response.ok) {
          alert("something wrong :(");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("product deleted successfully:)");
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setRows(Prows); // This assumes you still have the original Prows before filter
      });
  };

  const handleEditRow = (productId) => {
    setIsUpdateModalOpen(true);
    setIsAddModalOpen(false);
    setRowToEdit(productId);
    setcurrentProductId(productId);
  };

  const handleSubmit = (updateProduct) => {
    const updatedRows = Prows.map((row) =>
      row.id === updateProduct.id ? updateProduct : row
    );
    setRows(updatedRows);
    setIsUpdateModalOpen(false);
  };
  const handleAddButtonClick = () => {
    // Open the add modal and make sure the update modal is closed
    setIsAddModalOpen(true);
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="editProduct">
      <button onClick={handleAddButtonClick} className="addButton">
        Add
      </button>
      <Table rows={Prows} deleteRow={handleDeleteRow} editRow={handleEditRow} candlesIMG={imgUrlC} Paints={imgUrlP}/>
      {isAddModalOpen && (
        <ModalAdd
          closeModal={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}
      {isUpdateModalOpen && (
        <UPDATEModal
          closeModal={() => {
            setIsUpdateModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={Prows.find((row) => row.id === currentProductId) || {}}
          productId={currentProductId}
        />
      )}
    </div>
  );
}

export default EditProduct;
