import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "./Table.css";
export const Table = ({ rows, deleteRow, editRow }) => {
  return (
    <div className="table-wrapper">
      <h1>Courses Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="optional-column">Name</th>
            <th className="expand">Description</th>
            <th>Price</th>
            <th>Participants</th>
            <th>Age</th>
            <th>Date</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
              idx = row.id;
            return (
              <tr key={idx}>
                <td className="optional-column">{row.name}</td>
                <td className="expand">{row.description}</td>
                <td>{row.price}</td>
                <td>{row.participantsnumber}</td>
                <td>{row.age}</td>
                <td>{row.date}</td>
                <td><img className="CourseImg" src={`${process.env.PUBLIC_URL}${row.photo}`} alt="Course"></img></td>
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