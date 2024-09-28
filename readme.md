
# IRCTC Backend API

## Overview
IRCTC Backend APIs is a web application designed to streamline train bookings and seat reservations within a railway system. It provides a comprehensive set of APIs that empower users to reserve seats on trains and access their booking information. Additionally, it includes administrative functionalities for managing train schedules and monitoring seat availability, ensuring smooth and efficient operations for the railway system.

## Features

- Register a User (By default normal user and the other one is an admin user).
- Login User
- Add a New Train: for the admin to create a new train with a source and destination.
- Get Seat Availability: they can enter the source and destination and fetch all the trains between that route with their availabilities.
- Book a Seat: the users to book a seat on a particular train.
- Get Specific Booking Details: Users can view their booking history and details.

### Handling Race Conditions

I implemented a concurrency control mechanism to ensure that only one user can successfully book seats when multiple users attempt to book simultaneously.

#### Approach

1. **Atomic Database Operations**: Utilized the transaction feature provided by the database to ensure that all database operations related to booking seats are atomic. This ensures that either all operations within a transaction are completed successfully, or none of them are.

2. **Concurrency Handling in Code**: I implemented error handling in the booking service code to detect and handle concurrency issues. If multiple booking requests are received simultaneously, only one request will be successfully processed, and the others will be rejected. This is achieved by using asynchronous functions and proper error-handling mechanisms.


#### Benefits

- **Data Integrity**: Using atomic database operations ensures data integrity and consistency even under high concurrency scenarios.
- **Improved User Experience**: Users experience fewer errors and a smoother booking process, as the system handles simultaneous booking requests effectively.

#### Future Improvements

- **Scaling**: As the application grows, we can further enhance scalability by deploying multiple instances of the booking service and load-balancing the incoming requests.
- **Optimistic Concurrency Control**: Implementing optimistic concurrency control mechanisms can provide better performance and scalability by allowing concurrent access to data while maintaining data consistency.

## Technologies Used

- Node.js: Backend runtime environment.
- Express.js: Web framework for Node.js.
- MySQL: Relational database for storing users, trains, and bookings data.

## DB Diagram

![Screenshot 2024-09-28 101014](https://github.com/user-attachments/assets/8dd9b7b1-5918-43fa-91b4-eca453fd542d)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhisheksabhi33/irctc-backend-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd irctc-backend-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:

- Create a `.env` file in the root directory.
- Add the required environment variables such as `PORT`, `JWT_SECRET`,  `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

5. **Set Up MySQL**:
   - Ensure you have MySQL installed and running on your local machine.
   - The application will automatically create a database with the name specified in the `DB_NAME` environment variable when it starts.


6. Run the application:

   ```bash
   npm start
   ```


## Endpoints:

### User Registration:

- **Endpoint**: `POST /api/user/register`  
  Allows new users to register by providing necessary details, enabling them to access booking functionalities.


 ![Screenshot 2024-09-28 105344](https://github.com/user-attachments/assets/3dc6f6db-2a0f-4dd3-9ec5-a4e87bde8360)

 By Defaults user role would be normal user
 We have to Go to mySQL db and need to update the role according to the needs of any user.
 Here we have setup the localhost mysql.
 
![Screenshot 2024-09-28 113607](https://github.com/user-attachments/assets/1852979a-ddb0-42df-a922-fd3be892ac98)

### User Login:

- **Endpoint**: `POST /api/user/login`  
  Authenticates users based on their credentials, granting them access to their accounts and booking services.
  
 ![Screenshot 2024-09-28 113654](https://github.com/user-attachments/assets/3b73d395-a686-4610-9695-8c3ebb473e97)

### Admin Train Management:

- **Endpoint**: `POST /api/admin/addtrain`  
  Enables admins to add new trains to the system.
  Also, We need to pass the token of the admin user in Authorization as Bearer Token (We have received this token while login)

 ![Screenshot 2024-09-28 120927](https://github.com/user-attachments/assets/d0bdde09-ff2f-408e-80f3-34d617845d83)


### Increase Seat Availability:

- **Endpoint**: `PUT /api/admin/increaseSeats`  
  Allows admins to increase the number of available seats for a specific train, enhancing booking opportunities.
 
 ![Screenshot 2024-09-28 115312](https://github.com/user-attachments/assets/b0ef7526-00b3-402a-b4a8-e75dcfbed9f3)

### Train Availability Check:

- **Endpoint**: `GET /api/train/availability?source={src}&destination={destination}`  
  Provides users with information on available trains between specified source and destination points, helping them make informed travel decisions.

  ![Screenshot 2024-09-28 115732](https://github.com/user-attachments/assets/c6513666-ed71-42e9-aee5-0b398944b19c)


### Booking a Ticket:

- **Endpoint**: `POST /api/booking`  
  Facilitates the booking of train tickets by users, creating a new entry in the bookings table for each reservation.


  ![Screenshot 2024-09-28 115627](https://github.com/user-attachments/assets/d7e7a738-34c9-4aaf-9b92-f193e1e14636)


### View Booking Details:

- **Endpoint**: `GET /api/booking/details`  
  Allows users to retrieve and view their booking details, providing essential information regarding their reservations.

 ![Screenshot 2024-09-28 115752](https://github.com/user-attachments/assets/dd901fd8-455b-4cad-8b12-27c7c21ff46b)


