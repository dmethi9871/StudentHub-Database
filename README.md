![student datamanagment](https://github.com/dmethi9871/StudentHub-Database/assets/76877961/2c16243c-8e90-4984-b96d-ac177e83788d)
![studentdb](https://github.com/dmethi9871/StudentHub-Database/assets/76877961/5f60e3bd-e579-4c64-9943-c79845deeca8)

# Student Data Management System

This application is designed to load student data from a CSV file into a database. The data includes student details such as name, age, class, address, and hobbies. The information is stored in three tables: one for basic student information, one for address details, and one for hobbies. These tables are appropriately connected using foreign keys.

## Prerequisites

Before setting up and running the project, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/student-data-management.git
   cd student-data-management
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Database Configuration:**
   - Create a MySQL database and update the database configuration in `config.js` with your credentials.

4. **Run the Application:**
   ```bash
   npm start
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `public/`: Contains HTML, CSS, and JS files for the frontend.
- `uploads/`: Directory to store uploaded CSV files.
- `config.js`: Database configuration file.
- `app.js`: Main application file.

## Importing Sample Data

1. **CSV File Format:**
   - Prepare a CSV file with columns: name, age, class, address_street, address_city, address_state, address_zipcode, hobby1, hobby2, hobby3.

2. **Upload CSV File:**
   - Access the application at [http://localhost:3000](http://localhost:3000).
   - Use the file upload feature to upload your CSV file.

3. **View and Edit Data:**
   - Once uploaded, the data will be listed, and you can edit the information as needed.

## Additional Notes

- This project uses Express.js for the backend, MySQL for the database, and Multer for file uploading.
- Ensure that the required npm packages are installed by running `npm install`.
- Customize the frontend files in the `public/` directory to match your application's design.

Feel free to extend this README with more specific details about your project, features, and any additional setup steps.
```

Note: Replace placeholders like `your-username` and adapt paths accordingly based on your project's structure. Also, update the README with more details as needed for your specific application.
