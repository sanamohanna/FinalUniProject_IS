import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/LogIn/login";
import { ReactFirebaseFileUpload } from "./Pages/Images_Uploades/images_upload";
import EditCourses from "./Pages/Courses/EditCourses";
import HomeCards from "./Pages/HomePage/Home";
import ShowOrders from "./Pages/Orders/showOrders";
import EditProduct from "./Pages/Products/EditProduct";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/firebase" element={<ReactFirebaseFileUpload />} />
          <Route path="/editcourse" element={<EditCourses />} />
          <Route path="/home" element={<HomeCards />} />
          <Route path="/orders" element={<ShowOrders />} />
          <Route
            path="/table"
            element={
              <>
                <EditProduct />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
