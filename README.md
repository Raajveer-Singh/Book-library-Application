# 📚 Book Library Web Application

## Introduction
A **full-stack MERN web application** that allows users to manage a personal book collection with **role-based access control**.  
- **Admins** can add, update, and delete books.  
- **Users** can borrow and return books.  
- The system ensures accurate tracking of book availability, prevents duplicate borrowing, and supports full **CRUD operations** with validation.

## 🚀 Features

### 👨‍💻 User Features
- Sign up and log in securely with JWT authentication.
- Browse available books in the library.
- Borrow and return books.
- Prevents borrowing the same book twice.
- View borrowed books.

### 🛠️ Admin Features
- Add new books with details (title, author, category, etc.).
- Update existing book details.
- Delete books from the library.
- Manage book availability status.

### ⚙️ System Features
- Role-based authentication (Admin / User).
- Full **CRUD** support for books.
- MongoDB database for storing users and books.
- Proper validation for all API requests.
- Tracks book availability in real-time.

## Technologies Used
- **Frontend**: React.js + Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Cascading Style Sheets
- **API Testing**: ThunderAPI (for backend API testing)

## Prerequisites
Before running the application, ensure you have the following installed:

- Node.js (v14+)
- npm (v6+)
- MongoDB (local instance or MongoDB Atlas)

## Installation and Setup

Follow these steps to set up and run the application on your local system:

##  Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Raajveer-Singh/book-library-app.git
cd book-library-app
```
## Install Dependencies
Install dependencies for both the client and server:

For the **Backend** (server):
Navigate to the backend folder and install the required dependencies:

```bash
cd backend
npm install
```

For the **Frontend** (client):
Navigate to the client folder and install the necessary dependencies:

```bash
cd frontend
npm install
```

## Set Up Environment Variables
In the server folder, create a .env file (if not already provided) with the following environment variables:

``` .env
PORT = 5000
MONGODB_URI = mongodb+srv://libraryAdmin:123@librarycluster.r3ucvpf.mongodb.net/
JWT_SECRET = mysecretkey123
```

## Start the Application
Now you can start both the backend and frontend servers.

### Start the Backend:
Navigate to the root of the server directory and run:

```bash
cd backend
npm run dev
```
This will start the backend server.

### Start the Frontend:
Next, navigate to the client directory and run:

```bash
cd frontend
npm run dev
```
This will start the React frontend.

## Access the Application
Once both the backend and frontend are running:<br/><br/>
**Backend**: The backend will be accessible at http://localhost:5000.<br/><br/>
**Frontend**: The frontend will be accessible at http://localhost:5173.<br/><br/>
You can now open your browser and start using the Book Library Web Application.<br/> <hr/>

### Landing Page
![Landing Page](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20213834.png)
<br/> <hr/>

### Admin Login Page
![Admin Pagee](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20213811.png)
<br/> <hr/>

### Login Form
![Login Form](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20213858.png)
<br/> <hr/>

### Registration Form
![Registration Form](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20213921.png)
<br/> <hr/>

### User Login Page
![User Login Page](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20213944.png)
<br/> <hr/>

### Add Book Functionality
![Add Book Functionality](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20215619.png)
<br/> <hr/>

### Borrow Book Functionality
![Borrow Book Functionality](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20214000.png)
<br/> <hr/>

### History Functionality
![History Functionality](https://github.com/Raajveer-Singh/Book-library-Application/blob/b49c9cbc9e42438c49b693e73596a7b7ecbda95e/frontend/screenshots/Screenshot%202025-10-04%20214103.png)
<br/> <hr/>



