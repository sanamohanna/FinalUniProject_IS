import React from "react";
import "./Home.css";
import { Link } from 'react-router-dom';

export default function HomeCards() {
    return (
        <div>
            <div className="CoursesCard-item">
                <div className="CoursesCard-text">
                <Link to="/editcourse">Courses</Link>
                </div>
            </div>
            <div className="ProductCard-item">
                <div className="ProductCard-text">
                <Link to="/table">Products</Link>
                </div>
            </div>
            <div className="OrderCard-item">
                <div className="OrderCard-text">
                <Link to="/orders">Orders</Link>
                </div>
            </div>
        </div>
    );

}
