import db from "../config/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();

const bookSeat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { trainId, bookedSeats } = req.body;

    db.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Begin a database transaction
      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error starting database transaction:", err);
          connection.release(); // Always release the connection
          return res.status(500).json({ error: "Internal server error" });
        }

        const getTrainQuery = "SELECT * FROM trains WHERE id = ?";
        connection.query(getTrainQuery, [trainId], (err, results) => {
          if (err) {
            console.error("Error checking train availability:", err);
            connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Internal server error" });
            });
          } else if (
            results.length === 0 ||
            results[0].available_seats < bookedSeats
          ) {
            connection.rollback(() => {
              connection.release();
              return res
                .status(400)
                .json({ error: "Invalid train or insufficient seats" });
            });
          } else {
            // Lock the train row for update to prevent race conditions
            const lockTrainQuery =
              "SELECT * FROM trains WHERE id = ? FOR UPDATE";
            connection.query(
              lockTrainQuery,
              [trainId],
              (err, lockedResults) => {
                if (err) {
                  console.error("Error locking train row:", err);
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
                  });
                } else if (lockedResults[0].available_seats < bookedSeats) {
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(400)
                      .json({ error: "Insufficient seats" });
                  });
                } else {
                  // Inserting the booking into the database
                  const insertBookingQuery =
                    "INSERT INTO bookings (user_id, train_id, booked_seats) VALUES (?, ?, ?)";
                  connection.query(
                    insertBookingQuery,
                    [userId, trainId, bookedSeats],
                    (err, result) => {
                      if (err) {
                        console.error(
                          "Error inserting booking into database:",
                          err
                        );
                        connection.rollback(() => {
                          connection.release();
                          return res
                            .status(500)
                            .json({ error: "Internal server error" });
                        });
                      } else {
                        console.log("Booking inserted into database:", result);

                        // Updating the available seats for the train
                        const updateTrainQuery =
                          "UPDATE trains SET available_seats = available_seats - ? WHERE id = ?";
                        connection.query(
                          updateTrainQuery,
                          [bookedSeats, trainId],
                          (err, result) => {
                            if (err) {
                              console.error(
                                "Error updating train availability:",
                                err
                              );
                              connection.rollback(() => {
                                connection.release();
                                return res
                                  .status(500)
                                  .json({ error: "Internal server error" });
                              });
                            } else {
                              console.log(
                                "Train availability updated:",
                                result
                              );

                              // Commit the transaction
                              connection.commit((err) => {
                                if (err) {
                                  console.error(
                                    "Error committing transaction:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.release();
                                    return res
                                      .status(500)
                                      .json({ error: "Internal server error" });
                                  });
                                } else {
                                  connection.release(); // Release the connection back to the pool
                                  return res.status(201).json({
                                    message: "Seat booked successfully",
                                  });
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      });
    });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    const getBookingsQuery = "SELECT * FROM bookings WHERE user_id = ?";
    db.query(getBookingsQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching booking details:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ bookings: results });
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { bookSeat, getBookingDetails };
