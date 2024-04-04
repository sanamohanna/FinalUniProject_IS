import React, { useState, useEffect } from "react";
import "./style.css"; // Adjust the path according to your project structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ResponsiveNavbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800); // Added this line

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    console.log("Toggling sidebar");
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <nav
      style={{
        backgroundColor: "white",
        boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <ul
        className="sidebar"
        style={{ display: isSidebarVisible ? "flex" : "none" }}
        onClick={toggleSidebar}
      >
        {/* Sidebar items */}
        <li>
          <a href="/" className="HomePageLink">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="AboutUsPageLink">
            About Us
          </a>
        </li>
        <li>
          <a href="/Candels" className="ProductsPageLink">
            candels
          </a>
        </li>
        <li>
          <a href="/PaintProduct" className="ProductsPageLink">
            PaintProduct
          </a>
        </li>

        <li>
          <a href="/courses" className="CoursesPageLink">
            Courses
          </a>
        </li>

        <li>
          <a href="/cart" className="CartPageLink">
            <FontAwesomeIcon
              className="fa fa-shopping-cart"
              icon={faShoppingCart}
            />
          </a>
        </li>
        <li>
          <a href="/profile" className="ProfilePageLink">
            <FontAwesomeIcon className="fa-user" icon={faUser} />
          </a>
        </li>
        <li>
          <a href="/login" className="logout">
            logout
          </a>
        </li>
        <li>
          <a href="/login" className="navbarlogin_res">
            login
          </a>
        </li>
      </ul>
      <ul>
        {/* Main navigation items */}
        <li>
          <a href="/">RAHAF</a>
        </li>
        <li className="hideOnMobile">
          <a href="/">Home</a>
        </li>

        <li className="hideOnMobile">
          <a href="/Candels">Candels</a>
        </li>
        <li className="hideOnMobile">
          <a href="/PaintProduct">PaintProduct</a>
        </li>
        <li className="hideOnMobile">
          <a href="/courses">Courses</a>
        </li>
        <li className="hideOnMobile">
          {" "}
          <a href="/cart" className="CartPageLink">
            <FontAwesomeIcon
              className="fa fa-shopping-cart"
              icon={faShoppingCart}
            />
          </a>{" "}
        </li>
        <li className="hideOnMobile">
          <a href="/profile" className="ProfilePageLink">
            <FontAwesomeIcon className="fa-user" icon={faUser} />
          </a>
        </li>
        <li className="hideOnMobile">
          <a href="/login" className="logout">
            logout
          </a>
        </li>
        <li className="hideOnMobile">
          <a href="/login" className="navbarlogin_res">
            login
          </a>
        </li>
        <li
          className="menu-button"
          onClick={toggleSidebar}
          style={{ display: isMobile ? "block" : "none" }}
        >
          <a href="#">Menu</a>
        </li>
      </ul>
    </nav>
  );
};

export default ResponsiveNavbar;
