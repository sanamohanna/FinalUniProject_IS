import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "./TableP.css";

export const Table = ({ rows, deleteRow, editRow, candlesIMG, Paints}) => {
  console.log(Paints);
  console.log(candlesIMG);
  return (
    <div className="table-wrapper">
      <h1>Products Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="optional-column">Name</th>
            <th className="expand">Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
              idx = row.id;
              const imageName = `p${row.id}.PNG`;
              const imageName1 = `p${row.id}.jpeg`;
              let image = '';
              // Find the corresponding image URL
              if(row.categoryname == 'Paint Art'){
                 image = Paints.find((img) =>  img.name === imageName || img.name === imageName1);
              }
              if(row.categoryname == 'Candles'){
                 image = candlesIMG.find((img) => img.name === imageName || img.name === imageName1);
              } 

            return (
              <tr key={idx}>
                <td className="optional-column">{row.productname}</td>
                <td className="expand">{row.description}</td>
                <td>{row.price}</td>
                <td>{row.categoryname}</td>
                <td><img
                  src={image ? image.url : "path/to/default/image"}
                  alt={row.name}
                  className="card-img-top"
                  style={{ width: "70%", height: "200px" }}
                /></td>
                <td className="fit">
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => deleteRow(idx)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};