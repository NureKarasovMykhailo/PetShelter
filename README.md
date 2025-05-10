# 🐾 PetShelter

**PetShelter** is a full-stack web application designed to automate the operations of animal shelters. It simplifies animal management, guardianship applications, and volunteer recruitment, allowing shelters to focus on animal care while users can easily become guardians or volunteers.

## 📋 Overview

PetShelter was developed as part of my university coursework to demonstrate my skills in full-stack web development. I built this project entirely on my own, taking full responsibility for both backend and frontend development, database management, and third-party integrations. My contributions included designing and implementing the REST API, integrating PayPal for subscriptions, configuring the PostgreSQL database with migrations, and developing a multilingual interface (English and Ukrainian) using React.

This project highlights my ability to work independently, manage complex tasks, and apply modern web technologies—key skills for a Fachinformatiker für Anwendungsentwicklung role. It also demonstrates my problem-solving skills, as I overcame challenges like ensuring secure payment processing and optimizing database queries for efficient animal management.

## 🔧 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL
- REST API
- PayPal API

### Frontend
- React
- JavaScript

### DevOps & Tools
- Git & GitHub
- Postman (for API testing)
- VS Code
- ESLint & Prettier (for code quality)
- pgAdmin (for database management)

## 🚀 Features

- **User Registration and Authentication**: Secure account creation and login for users.
- **Animal Management**: Add, edit, and delete animal profiles (for admins).
- **Guardianship Applications**: Guests can view animal profiles and submit guardianship requests.
- **User Roles**: Different roles for animal admins and guardianship admins.
- **Volunteer Announcements**: Create and display announcements for volunteer recruitment.
- **Subscription System**: Users can subscribe to the service via PayPal.
- **Multilingual Interface**: Supports English and Ukrainian languages.

## 📲 Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)

### Instructions
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/NureKarasovMykhailo/PetShelter.git
   cd PetShelter
   ```

2. **Setup the Project**  
   - **Install Backend Dependencies**:
     ```bash
     cd back-end
     npm install
     cd ..
     ```
   - **Install Frontend Dependencies**:
     ```bash
     cd front-end
     npm install
     cd ..
     ```
   - Copy the `.env.example` file to `.env` in the `back-end` folder and configure your environment variables (e.g., database URL):
     ```bash
     cp back-end/.env.example back-end/.env
     ```
   - **Configure PayPal API**:
     - Go to the [PayPal Developer Dashboard](https://developer.paypal.com/developer/applications/) and sign in or create a PayPal account.
     - Create a new Sandbox app:
       - Navigate to "My Apps & Credentials" > "Sandbox" > "Create App".
       - Give your app a name (e.g., `PetShelterApp`) and create it.
     - Copy the `Client ID` and `Secret` from the app details.
     - Add these credentials to your `back-end/.env` file:
       ```
       PAYPAL_CLIENT_ID=your_client_id_here
       PAYPAL_SECRET=your_secret_here
       PAYPAL_MODE=sandbox
       ```
     - Note: The `PAYPAL_MODE` is set to `sandbox` for testing. For production, change it to `live` and use live credentials.
   - Create the database:
     ```bash
     createdb pet_shelter
     ```
   - Run migrations (from the `back-end` folder):
     ```bash
     cd back-end
     npm run migrate
     cd ..
     ```
   - **Manually Add Roles and Admin User to the Database**:
     - Connect to your PostgreSQL database using `psql` or pgAdmin:
       ```bash
       psql -d pet_shelter
       ```
     - Create roles in the `roles` table:
       ```sql
       INSERT INTO roles (role_title, createdAt, updatedAt)
       VALUES 
         ('employee', NOW(), NOW()),
         ('systemAdmin', NOW(), NOW()),
         ('subscriber', NOW(), NOW()),
         ('petAdmin', NOW(), NOW()),
         ('adoptionAdmin', NOW(), NOW()),
         ('workerAdmin', NOW(), NOW());
       ```
     - Insert a user into the `users` table (replace `admin@example.com` and `password123` with your desired email and password):
       ```sql
       INSERT INTO users (login_image, user_image, domain_email, email, full_name, birthday, phone_number, date_of_registration, hashed_password, is_paid, subscriptionId, createdAt, updatedAt, shelterId)
       VALUES (NULL, NULL, 'admin@domain.com', 'admin@example.com', 'Admin User', '1990-01-01', '+1234567890', NOW(), crypt('password123', gen_salt('bf')), false, NULL, NOW(), NOW(), NULL);
       ```
     - Get the `id` of the newly created user:
       ```sql
       SELECT id FROM users WHERE email = 'admin@example.com';
       ```
       (Запомни этот `id`, например, 1.)
     - Get the `id` of the `systemAdmin` role:
       ```sql
       SELECT id FROM roles WHERE role_title = 'systemAdmin';
       ```
       (Запомни этот `id`, например, 2.)
     - Link the user to the `systemAdmin` role in the `user_roles` table:
       ```sql
       INSERT INTO user_roles (userId, roleId, createdAt, updatedAt)
       VALUES (1, 2, NOW(), NOW());
       ```
     - Note: Replace `1` and `2` with the actual `id` values from the previous queries. Ensure all tables (`roles`, `users`, `user_roles`) exist with the specified columns. The `crypt` function with `gen_salt('bf')` is used for password hashing (adjust if your project uses a different method, e.g., `bcrypt`).
   - Place default images in the `front-end/public/` folder:
     - Add `default-shelter-image.jpg` and `default-user-image.jpg` to `front-end/public/images/` (or adjust the path based on your project structure).
     - These images will be used as placeholders for shelters and users if no custom images are uploaded.
   - Start the application:
     - Open two terminal windows:
       - In the first terminal, start the backend:
         ```bash
         cd back-end
         npm start
         ```
       - In the second terminal, start the frontend:
         ```bash
         cd front-end
         npm start
         ```

## 🛠️ Challenges and Skills Applied
- **REST API Development**: Designed and implemented a REST API using Express.js to handle user requests, animal data, and guardianship applications.
- **Payment Integration**: Integrated PayPal API for secure subscription payments, ensuring a seamless user experience by setting up sandbox testing and handling payment callbacks.
- **Database Management**: Configured PostgreSQL database, including schema design, migrations, and query optimization for efficient data retrieval, with support for roles and user-role
