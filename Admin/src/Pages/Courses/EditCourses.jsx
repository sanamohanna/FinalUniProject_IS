import React from "react";
import { useState, useEffect } from "react";
import { courseService } from "./CourseService";
import { Table } from "./Table";
import { UPDATEModal } from "./ModalUpdate";
import { ModalAdd } from "./ModalAdd";
function EditCourses() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [Crows, setRows] = useState([]);
  const [currentCourseId, setCurrentCourseId] = useState(null); // New state to keep track of the current editing course ID

  useEffect(() => {
    courseService
      .getCourses()
      .then((data) => {
        console.log("Fetched data:", data.rows); // Check the actual structure of the fetched data
        setRows(data.rows);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setRows([]); // Ensure courses is an empty array in case of error
      });
  }, []);
  const [rowToEdit, setRowToEdit] = useState(null);
  const handleAddCourse = (courseData) => {
    // Update the state with the new course
    setRows([...Crows, courseData]);
  };
  const handleDeleteRow = (targetIndex) => {
    const newCourses = Crows.filter((Crows) => Crows.id !== targetIndex);
    setRows(newCourses);
    fetch(`http://localhost:3002/DeleteCourses/${targetIndex}`, {
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
        alert("course deleted successfully:)");
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setRows(Crows); // This assumes you still have the original Crows before filter
      });
  };

  const handleEditRow = (courseId) => {
    setIsUpdateModalOpen(true);
    setIsAddModalOpen(false);
    setRowToEdit(courseId);
    setCurrentCourseId(courseId);
  };

  const handleSubmit = (updatedCourse) => {
    const updatedRows = Crows.map((row) =>
      row.id === updatedCourse.id ? updatedCourse : row
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
    <div className="editCourses">
      <Table rows={Crows} deleteRow={handleDeleteRow} editRow={handleEditRow} />
      <button onClick={handleAddButtonClick} className="addButton">
        Add
      </button>
      {isAddModalOpen && (
        <ModalAdd
          closeModal={() => setIsAddModalOpen(false)}
          onAddCourse={handleAddCourse}
        />
      )}
      {isUpdateModalOpen && (
        <UPDATEModal
          closeModal={() => {
            setIsUpdateModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={Crows.find((row) => row.id === currentCourseId) || {}}
          courseId={currentCourseId}
        />
      )}
    </div>
  );
}

export default EditCourses;
