const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3002;
const db = require("./Database/connection");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000", // Allow only this origin to access
  credentials: true, // Allow cookies / credentials
};
app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allows requests from this origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  // Add this line to include credentials in the CORS policy
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
app.get("/", (req, res) => {
  res.status(200).send(`<h1>Hello world</h1>`);
});

app.get("/signup", async (req, res) => {
  let users = await db.query("SELECT * FROM users");
  console.log("from GetSignup" + users.rowCount);
  res.json(users);
});

app.get("/login", async (req, res) => {
  let users = await db.query("SELECT * FROM users");
  console.log("from GetLogin " + users.rowCount);
  res.json(users.rowCount);
});
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email, address, postalcode } = req.body;
    console.log(username);
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    let newuser = await db.query(
      `INSERT INTO users (username, userPassword, email, address, postalcode) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, hash, email, address, postalcode]
    );
    console.log("after adding new User");

    res.cookie("userid", newuser.rows[0].id, { maxAge: 18000000 });

    let users = await db.query("SELECT * FROM users");
    count = users.rowCount;
    res.json({
      status: 200,
      message: "User successfully created",
      count: users.rowCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(`not found`);
  }
});

app.get("/candels", async (req, res) => {
  let products = await db.query("SELECT * FROM products where category_id = 1");
  res.json(products.rows);
});
app.get("/Courses", async (req, res) => {
  console.log("HEY");
  let courses = await db.query("SELECT * FROM courses");
  console.log("fromCourses " + courses.rowCount);
  res.json(courses);
});

app.get("/GetProduct", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query(
    "SELECT c.id as categoryid ,c.name as categoryname, p.id,p.name as productname, p.description , p.price  FROM category as c INNER JOIN products as p on c.id = p.category_id "
  );
  res.json(product.rows);
});

app.get("/GetOrder", async (req, res) => {
  let orders = await db.query(
    "SELECT o.id as orderid, o.status as status , p.name as productname , od.quantity FROM orders as o INNER JOIN orderDetails as od on o.id = od.order_id inner join products as p on p.id = o.id   "
  );
  res.json(product.rows);
});

app.get("/category", async (req, res) => {
  let category = await db.query("SELECT * FROM category");
  res.json(category.rows);
});
app.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email, password);
    let userPassword = await db.query(`SELECT * FROM users WHERE email = $1 `, [
      email,
    ]);
    let pass = userPassword.rows.map((e) => e.userpassword);
    let user_id = userPassword.rows.map((e) => e.id);
    let users = await db.query(`SELECT email FROM users WHERE email = $1 `, [
      email,
    ]);
    let newusers = users.rows.map((e) => e.email);
    let comparepass = await bcrypt.compare(password, pass[0]);
    if (newusers.length === 0) {
      res.json({ status: false, message: "something..." });
    } else if (newusers[0] === users.rows[0].email && comparepass === true) {
      res.cookie("userid", user_id, { maxAge: 18000000 });
      res.json({ status: true, message: "welcome.." });
    } else {
      res.json({ status: false, message: "try again" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(`not found`);
  }
});

// function deleteCookie(name) {
//   if (
//     document.cookie
//       .split(";")
//       .some((item) => item.trim().startsWith(name + "="))
//   ) {
//     // Set the cookie to expire in the past, effectively deleting it
//     document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
//     console.log(`${name} cookie has been deleted.`);
//   } else {
//     console.log(`${name} cookie does not exist.`);
//   }
// }

app.get("/images", async (req, res) => {
  let images = await db.query("SELECT * FROM images");
  console.log(images.rowCount);
  res.json(images);
});

app.get("/cart", async (req, res) => {
  const userId = req.cookies.userid[0];
  console.log(userId);
  let product = await db.query(
    "Select * from cart as c inner join products as p on p.id = c.product_id WHERE c.user_id = $1 ",
    [userId]
  );
  res.json(product.rows);
});
app.get("/allOrders", async (req, res) => {
  let orders = await db.query("SELECT * FROM orders");
  res.json(orders);
});

app.post("/cart", async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.cookies.userid[0];
    const key = req.body.key;
    console.log(1, userId);
    if (req.body.flag === "update") {
      console.log("Hi,I'm hereeeee :)");
      const quantity = req.body.quantity;
      if (quantity > 0) {
        await db.query(
          `UPDATE cart SET quantity=${quantity} WHERE user_id=${userId} AND product_id=${key}`
        );
      } else if (quantity < 1) {
        await db.query(
          `DELETE FROM cart where product_id=${key} AND user_id=${userId}`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/cartToOrder", async (req, res) => {
  try {
    const userId = req.cookies.userid[0];
    const cartItems = await db.query(
      "SELECT * FROM cart AS c INNER JOIN products AS p ON p.id = c.product_id WHERE c.user_id = $1",
      [userId]
    );

    const orderRes = await db.query(
      "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id",
      [userId, "pending"]
    );
    const orderId = orderRes.rows[0].id;

    for (let item of cartItems.rows) {
      await db.query(
        "INSERT INTO orderDetails (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.product_id, item.quantity]
      );
    }

    await db.query("DELETE FROM cart WHERE user_id = $1", [userId]);
    res.json({ status: "true" });
  } catch (error) {
    console.log(error);
    res.json({ status: "false" });
  }
});
app.put("/UpdateProducts/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  const { name, description, price, category } = req.body;
  let result = await db.query(
    ` SELECT category.id FROM category where category.name = $1`,
    [category]
  );
  let idCategory = result.rows[0].id;
  try {
    const updateQuery = `
      UPDATE products
      SET name = $1, description = $2, price = $3, category_id = $4
      WHERE id = $5
    `;

    const result = await db.query(updateQuery, [
      productname,
      description,
      price,
      idCategory,
      id,
    ]);

    // Check if the update was successful
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "product not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});
app.post("/AddProduct", async (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  let price = req.body.price;
  let category = req.body.category;
  console.log([name] + "+" + [description] + "+" + [price] + "+" + [category]);
  let result = await db.query(
    ` SELECT category.id FROM category where category.name = $1`,
    [category]
  );
  if (result.rows.length > 0) {
    let idCategory = result.rows[0].id;
    let newProduct = await db.query(
      `INSERT INTO products (name , description , price , category_id) VALUES ($1, $2, $3 , $4) RETURNING *`,
      [name, description, price, idCategory]
    );
    let productID = newProduct.rows[0].id;
    let newimage = await db.query(
      ` INSERT INTO images (product_id) VALUES ($1)`,
      [productID]
    );
    const query = db.query(`SELECT MAX(id) as maxid FROM products`);
    const maxid = (await query).rows[0].maxid;
    res.json({ status: "true", id: maxid });
  } else {
    console.log("No category found with the given name.");
    res.json({ status: "false" });
  }
});
app.post("/AddProductToCart", async (req, res) => {
  const userId = req.cookies.userid[0];
  const product = req.body.item;
  try {
    if (!userId) {
      response.json({
        status: false,
        message: "Please Login to Add products to the cart",
      });
    } else {
      const data = await db.query(
        `SELECT * FROM cart where product_id = $1 and user_id = $2`,
        [product.id, userId]
      );
      if (data.rows.length === 0) {
        console.log("ERROR1");
        await db.query(
          `INSERT INTO cart (user_id, product_id, quantity ) VALUES ($1, $2, $3) RETURNING *`,
          [userId, product.id, 1]
        );
        res.json({ status: true });
      } else if (data.rows.length > 0) {
        let Currentquantity = data.rows.find((element) => element.quantity);
        console.log("test1", Currentquantity);
        Currentquantity.quantity += 1;
        console.log("test2", Currentquantity.quantity);
        await db.query(
          `update cart set quantity=$1 where user_id = $2  and product_id = $3 `,
          [Currentquantity.quantity, userId, product.id]
        );
      } else {
        res.json({ status: true });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/Getorder'sProduct/:id", async (req, res) => {
  const { id } = req.params;
  console.log("from server: " + id);
  // Check if the id is not undefined and is an integer
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid order ID." });
  }

  try {
    let orderProduct = await db.query(
      `
                              SELECT o.id as orderid, p.* , od.quantity as quantity , c.name as category
                              FROM orders as o 
                              INNER JOIN orderDetails as od on o.id = od.order_id 
                              inner join products as p on p.id = od.product_id
                              inner join category as c on p.category_id=c.id
                              WHERE o.id = $1`,
      [id]
    );
    res.json(orderProduct.rows); // Make sure to send the rows if that's what you intend to send.
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/DeleteCourses/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  try {
    // Construct the SQL query. Use parameterized queries to avoid SQL injection
    const deleteQuery = `
      DELETE FROM courses
      WHERE id = $1
    `;

    // Execute the query
    const result = await db.query(deleteQuery, [id]);

    // Check if the delete was successful
    if (result.rowCount === 0) {
      // No rows deleted, send a 404 response
      return res.status(404).json({ message: "Course not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course" });
  }
});
app.delete("/DeleteProducts/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  try {
    const deleteIMG = `DELETE FROM images WHERE product_id = $1`;
    const resultIMG = await db.query(deleteIMG, [id]);
    // Construct the SQL query. Use parameterized queries to avoid SQL injection
    const deleteQuery = `
      DELETE FROM products
      WHERE id = $1
    `;

    // Execute the query
    const result = await db.query(deleteQuery, [id]);

    // Check if the delete was successful
    if (result.rowCount === 0) {
      // No rows deleted, send a 404 response
      return res.status(404).json({ message: "product not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../Admin/_admin/public/Imgs/corsesImg");
    const frontendpath = path.join(
      __dirname,
      "../FinalProject/public/Imgs/corsesImg"
    );

    // Create directory if it does not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(frontendpath)) {
      fs.mkdirSync(frontendpath, { recursive: true });
    }
    cb(null, dir);
    cb(null, frontendpath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

app.put("/updateOrderStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    console.log(status + "1123");
    const updateQuery = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
    `;
    const result = await db.query(updateQuery, [status, id]);
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "order not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "order status updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating status" });
  }
});
// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
app.put("/UpdateCourses/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  const { name, description, price, participantsnumber, age, date } = req.body; // Extract fields except 'photo'
  const photo = req.file
    ? `/Imgs/corsesImg/${req.file.filename}`
    : req.body.photo;

  try {
    const updateQuery = `
      UPDATE courses
      SET name = $1, description = $2, price = $3, participantsnumber = $4, age = $5, date = $6, photo = $7
      WHERE id = $8
    `;

    const result = await db.query(updateQuery, [
      name,
      description,
      price,
      participantsnumber,
      age,
      date,
      photo,
      id,
    ]);

    // Check if the update was successful
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "Course not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
});

app.post("/AddCourses", upload.single("photo"), async (req, res) => {
  const { name, description, price, participantsnumber, age, date } = req.body;
  const photo = `/Imgs/corsesImg/${req.file.filename}`;
  try {
    // Construct the SQL query to insert a new course.
    // Ensure that these field names match your database schema
    const insertQuery = `
      INSERT INTO courses (name, description, price, participantsnumber, age, date, photo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *; 
    `;

    // Execute the query
    const result = await db.query(insertQuery, [
      name,
      description,
      price,
      participantsnumber,
      age,
      date,
      photo,
    ]);

    // If the result is not present or the array is empty, throw an error
    if (!result.rows || result.rows.length === 0) {
      throw new Error("Insert failed");
    }

    // Send back the new course data, including the id
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding new course:", error);
    res.status(500).json({ message: "Error adding new course" });
  }
});

app.get("/paints", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query("select * from products where category_id = 2");
  res.json(product.rows);
});

app.get("/GetProduct", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query(
    "SELECT c.id as categoryid ,c.name as categoryname, p.id,p.name as productname, p.description , p.price  FROM category as c INNER JOIN products as p on c.id = p.category_id "
  );
  res.json(product.rows);
});

app.get("/orders", async (req, res) => {
  // Get the user ID from the request parameters
  const userId = req.cookies.userid[0];

  try {
    // Fetch orders only for the user with the specified ID
    let orders = await db.query("SELECT * FROM orders WHERE user_id = $1", [
      userId,
    ]);
    console.log(`Orders fetched for user ${userId}: ${orders.rowCount}`);

    // Send the orders as JSON
    res.json(orders.rows);
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}: `, error);
    res.status(500).json({ error: "An error occurred while fetching orders." });
  }
});
app.get("/userdetails", async (req, res) => {
  // Get the user ID from the request parameters
  const userId = req.cookies.userid[0];
  
  try {
    // Fetch orders only for the user with the specified ID
    let users = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    console.log(`details fetched for user ${userId}: ${users.rowCount}`);

    // Send the orders as JSON
    res.json(users.rows);
  } catch (error) {
    console.error(`Error fetching details for user ${userId}: `, error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching details." });
  }
});
app.put("/userdetails", async (req, res) => {
  const userId = req.cookies.userid[0];
  const { userName, email } = req.body;

  try {
    const updateQuery = `
      UPDATE users
      SET userName = $1, email = $2
      WHERE id = $3
    `;

    const result = await db.query(updateQuery, [userName, email, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
});
app.put("/userAddress", async (req, res) => {
  const userId = req.cookies.userid[0];
  const { address, postalcode } = req.body;

  try {
    const updateQuery = `
      UPDATE users
      SET address = $1, postalcode = $2
      WHERE id = $3
    `;

    const result = await db.query(updateQuery, [address, postalcode, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
});
app.put("/userpassword", async (req, res) => {
  const userId = req.cookies.userid[0];
  const { oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const userQueryResult = await db.query(
      `SELECT userPassword FROM users WHERE id = $1`,
      [userId]
    );
    console.log("Database query result:", userQueryResult.rows);

    // Fetch the user's current hashed password from the database
    const userPasswordHash = userQueryResult.rows[0].userpassword; // Use the correct case as it is in the database
    console.log("Hashed password from database:", userPasswordHash);

    // Continue with your logic...

    console.log("Old password from request:", oldPassword);
    console.log("Hashed password from database:", userPasswordHash);

    // Compare the provided old password with the hashed password from the database
    const match = await bcrypt.compare(oldPassword, userPasswordHash);

    if (match) {
      // If the passwords match, hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Adjust the salt rounds as necessary

      // Update the user's password in the database
      const updateResult = await db.query(
        `UPDATE users SET userPassword = $1 WHERE id = $2`,
        [hashedNewPassword, userId]
      );

      if (updateResult.rowCount === 0) {
        return res.status(404).json({ message: "Failed to update password" });
      }

      res.status(200).json({ message: "User password updated successfully" });
    } else {
      res.status(401).json({ message: "Old password is incorrect" });
    }
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ message: "Error updating user password" });
  }
});
