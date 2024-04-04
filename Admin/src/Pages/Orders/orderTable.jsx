import React from "react";
import { MdProductionQuantityLimits } from "react-icons/md";
import { PiXCircleDuotone } from "react-icons/pi"; // Assuming correct import path
import { FcApproval } from "react-icons/fc"; // Assuming correct import path
import "./orderTable.css";

export const Table = ({ rows, showRow, approveOrder, disapproveOrder }) => {
  return (
    <div className="show_table-wrapper">
      <h1>Courses Table</h1>
      <table className="show_table">
        <thead>
          <tr>
            <th>order id</th>
            <th>user id</th>
            <th>order status</th>
            <th>order products</th>
            <th>actions</th> {/* Additional header for actions */}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.user_id}</td>
              <td>{row.status}</td>
              <td className="fit">
                <span className="actions">
                  <MdProductionQuantityLimits
                    className="show-btn"
                    onClick={() => showRow(row.id)}
                  />
                </span>
              </td>
              <td>
                {row.status === 'pending' && (
                  <div className="actions">
                    <FcApproval className="action-icon" onClick={() => approveOrder(row.id)} />
                    <PiXCircleDuotone className="action-icon" onClick={() => disapproveOrder(row.id)} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
