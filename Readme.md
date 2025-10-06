# Inventory Management System API

- A backend-heavy API to manage products and inventory in a warehouse. Users can view products, while admins can fully manage the inventory, including creating, updating, deleting, and adjusting stock.

- This project emphasizes robust inventory logic, secure access control with JWT, and full CRUD operations, making it perfect for warehouse management or internal inventory tracking.

## Project Goal

- A scalable API for product management.

- Handle real-world inventory scenarios, including stock limits, low stock alerts, and restricted admin operations.

- Write unit tests to validate business logic.

### Core Features

1. Product Management (CRUD)

    - Create, Read, Update, Delete endpoints for products.

    - Product fields:
        ```
            {
            "name": "Product Name",
            "description": "Product Description",
            "stock_quantity": 100,
            "low_stock_threshold": 10
            }
        ```

    - Only admins can create, update, delete, or adjust stock.

    - Regular users can only fetch product list or details.

2. Inventory Logic

    - Stock quantity cannot go below zero.

    - Endpoints to increase/decrease stock:

    - Increase stock: Adds quantity to a product.

    - Decrease stock: Subtracts quantity, returns 400 Bad Request if insufficient stock.

3. Bonus Feature ✨

    - low_stock_threshold for products.

    - Endpoint to list products currently below the threshold.

4. Authentication & Authorization

    - JWT-based authentication.

    - Admin-only actions:

        1. Create Product

        2. Update Product

        3. Delete Product

        4. Increment/Decrement Stock

    - All users can:

        1. Fetch product list

        2. Fetch product details

###  Test Coverage
  - Unit tests for stock logic:

    1. Adding stock

    2. Removing stock

    3. Edge cases (removing more than available)

    4. Ensures all inventory rules are enforced.

###  Tech Stack

- Backend: Node.js + Express

- Database: MongoDB Atlas

- Authentication: JWT

- Testing: Jest + Supertest

- Env Management: dotenv

###  Installation & Running Locally

1. Clone the repository

    ```
    git clone https://github.com/snehabhandari-07/Inventory-Management-System-Backend.git
    cd Inventory-Management-System
    ```

2. Install dependencies

    ```
    npm install
    ```

3. Create .env file for development:

    ```
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_uri
    SECRET_KEY=your_jwt_secret
    ```

4. Create .env.test file for testing:

    ```
    MONGODB_URI=your_test_mongodb_uri
    SECRET_KEY=your_jwt_secret
    ```

- .env.test and .env should be added to .gitignore to keep credentials safe.

5. Run the development server

    ```
    npm server.js
    ```

- Server will run on http://localhost:5000.

6. Run tests

    ```
    npx jest
    ```

## 🛠️ Available Endpoints

| Method | Route                 | Access | Description                             |
|--------|-----------------------|--------|-----------------------------------------|
| GET    | /products             | Public | Get all products                        |
| GET    | /products/:id         | Public | Get product details                     |
| POST   | /products             | Admin  | Create new product                      |
| PUT    | /products/:id         | Admin  | Update product                          |
| DELETE | /products/:id         | Admin  | Delete product                          |
| PUT    | /products/:id/inc     | Admin  | Increase stock quantity                 |
| PUT    | /products/:id/dec     | Admin  | Decrease stock quantity                 |
| GET    | /products/low-stock   | Admin  | List products below low stock threshold |


### Authentication

- All admin routes require JWT in Authorization header:

    ```
    Authorization: Bearer <token>
    ```

- Tokens are generated when creating a test/admin user in DB:

- const token = jwt.sign({ id: user._id, role: "admin" }, process.env.SECRET_KEY, { expiresIn: "1h" });

### How This Project Excels

- Realistic inventory constraints with validation for stock limits.

- Role-based access control (users vs admins).

- Unit tests ensure reliability and prevent regressions.

- Clean, modular code for easy extension (e.g., adding new features like categories or suppliers).

### Render Deployed

- https://inventory-management-system-backend-xfvh.onrender.com

### Loom Video 

- https://www.loom.com/share/5df6aff757294b3e89e761913c31cdd5