const express = require("express");

const seatRouter = express.Router();

const { seatModel } = require("../models/model");

seatRouter.get("/", async (req, res) => {
  try {
    const seats = await seatModel.find();
    res.send({ seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

seatRouter.post("/add", async (req, res) => {
  try {
    await seatModel.create(req.body);
    res.send({ msg: "seats created" });
  } catch (error) {
    res.send({ msg: error });
  }
});

seatRouter.post("/reserve", async (req, res) => {
  try {
    const numSeats = req.body.numSeats;

    if (numSeats > 7) {
      return res
        .status(400)
        .json({ error: "Maximum 7 seats can be booked at a time" });
    }

    if (numSeats <= 0) {
      return res
        .status(400)
        .json({ error: "Number of seats must be greater than 0" });
    }

    // Find available seats in one row
    const availableSeatsInOneRow = await seatModel.aggregate([
      { $match: { isBooked: false } },
      { $group: { _id: "$row", count: { $sum: 1 } } },
      { $match: { count: { $gte: numSeats } } },
      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: "seats",
          localField: "_id",
          foreignField: "row",
          as: "seats",
        },
      },
      { $unwind: "$seats" },
      { $match: { "seats.isBooked": false } },
      { $sort: { "seats.seatNumber": 1 } },
      { $limit: numSeats },
    ]);

    if (availableSeatsInOneRow.length >= numSeats) {
      // Reserve seats in one row
      let temp = [];
      const seatIds = availableSeatsInOneRow.map((seat) => seat.seats._id);
      await seatModel.updateMany(
        { _id: { $in: seatIds } },
        { $set: { isBooked: true } }
      );
      availableSeatsInOneRow.map((seat) => {
        temp.push(seat.seats.seatNumber);
      });
      // return res.json({ message: 'Seats reserved successfully' });
      return res.json({ message: temp });
    }

    // Reserve seats in nearby rows
    const lastReservedRow = await seatModel
      .findOne({ isBooked: true })
      .sort({ row: -1 });
    const nextRow = lastReservedRow ? lastReservedRow.row + 1 : 1;

    const availableSeatsNearby = await seatModel.aggregate([
      { $match: { isBooked: false, row: nextRow } },
      { $sort: { seatNumber: 1 } },
      { $limit: numSeats },
    ]);

    if (availableSeatsNearby.length >= numSeats) {
      // Reserve seats in nearby rows
      let temp = [];
      const seatIds = availableSeatsNearby.map((seat) => seat._id);
      await seatModel.updateMany(
        { _id: { $in: seatIds } },
        { $set: { isBooked: true } }
      );
      awail;
      availableSeatsInOneRow.map((seat) => {
        temp.push(seat.seats.seatNumber);
      });
      // return res.json({ message: 'Seats reserved successfully' });
      return res.json({ message: temp });
    }

    if (availableSeatsInOneRow.length >= numSeats) {
      // Reserve seats in one row
      let temp = [];
      const seatIds = availableSeatsInOneRow.map((seat) => seat.seats._id);
      await seatModel.updateMany(
        { _id: { $in: seatIds } },
        { $set: { isBooked: true } }
      );
      availableSeatsInOneRow.map((seat) => {
        temp.push(seat.seats.seatNumber);
      });
      return res.json({ message: temp });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

seatRouter.put("/reset", async (req, res) => {
  try {
    // Reset all seats to unreserved
    await seatModel.updateMany({}, { isBooked: false });

    res.json({ message: "All seats reset to unreserved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  seatRouter,
};
