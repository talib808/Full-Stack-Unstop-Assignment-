import React, { useState, useEffect } from "react";
import axios from "axios";

const Reservation = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState("");
  const [book, setBook] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Fetch all seats from the backend
    const fetchSeats = async () => {
      try {
        await axios
          .get("https://kind-teal-fossa-veil.cyclic.app/seat")
          .then((res) => {
            console.log(res);
            function compare(a, b) {
              return a.seatNumber - b.seatNumber;
            }

            let y = res.data.seats;
            y.sort(compare);
            setSeats(y);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeats();
  }, []);

  const reserveSeats = async () => {
    try {
      await axios
        .post("https://kind-teal-fossa-veil.cyclic.app/seat/reserve", {
          numSeats: parseInt(numSeats),
        })
        .then((res) => {
          console.log(res.data.message);

          if (res.data.message) {
            setBook(res.data.message);
          }

          console.log(res);
        });

      // Refresh the seat data after reservation
      await axios
        .get("https://kind-teal-fossa-veil.cyclic.app/seat")
        .then((res) => {
          function compare(a, b) {
            return a.seatNumber - b.seatNumber;
          }

          let y = res.data.seats;
          y.sort(compare);
          setSeats(y);
          setNumSeats("");
          setMsg("");
        });
    } catch (error) {
      console.error(error.response.data.error);
      setMsg(error.response.data.error);
      setBook([]);
    }
  };

  const resetSeats = async () => {
    try {
      const response = await axios.put(
        "https://kind-teal-fossa-veil.cyclic.app/seat/reset"
      );
      console.log(response.data.message);
      // Refresh the seat data after resetting
      await axios
        .get("https://kind-teal-fossa-veil.cyclic.app/seat")
        .then((res) => {
          function compare(a, b) {
            return a.seatNumber - b.seatNumber;
          }

          let y = res.data.seats;
          y.sort(compare);
          setSeats(y);
          setBook([]);
        });
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f2f6fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        Unstop Seat Reservation Assignment
      </h1>
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginRight: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#FF6347",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          ></div>
          <div style={{ color: "#333" }}>Vacant Seats</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#2ECC71",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          ></div>
          <div style={{ color: "#333" }}>Booked Seats</div>
        </div>
      </div>
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <label
          htmlFor="numSeats"
          style={{
            fontSize: "20px",
            color: "#333",
            marginRight: "10px",
          }}
        >
          Number of Seats:
        </label>
        <input
          style={{
            height: "30px",
            width: "60px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            paddingLeft: "5px",
          }}
          type="number"
          id="numSeats"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button
          style={{
            backgroundColor: "#333",
            color: "white",
            width: "120px",
            height: "40px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
          onClick={reserveSeats}
        >
          Reserve Seats
        </button>
        <button
          style={{
            backgroundColor: "#FFA500",
            width: "120px",
            height: "40px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
          onClick={resetSeats}
        >
          Reset Seats
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          background: "white",
          padding: "20px",
          boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {seats.map((seat) => (
            <div
              key={seat._id}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: seat.isBooked ? "#2ECC71" : "#FF6347",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
                color: "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
              color: "#333",
              marginTop: "-380px",
            }}
          >
            <h4 style={{ marginRight: "5px" }}>Booked Seats No: </h4>
            {book.map((el, index) => (
              <p
                key={index}
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {el}
              </p>
            ))}
          </div>
          <div>
            <h4 style={{ color: "red", margin: 0 }}>{msg}</h4>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div
  //     style={{
  //       display: "flex",
  //       flexDirection: "column",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       minHeight: "100vh",
  //       background: "#f7f9fc",
  //     }}
  //   >
  //     <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#333" }}>
  //       Unstop Seat Reservation Assignment
  //     </h1>
  //     <div style={{ display: "flex", marginBottom: "20px" }}>
  //       <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "#FFD700",
  //             marginRight: "10px",
  //             borderRadius: "50%",
  //           }}
  //         ></div>
  //         <div style={{ color: "#555" }}>Vacant Seats</div>
  //       </div>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "#ADFF2F",
  //             marginRight: "10px",
  //             borderRadius: "50%",
  //           }}
  //         ></div>
  //         <div style={{ color: "#555" }}>Booked Seats</div>
  //       </div>
  //     </div>
  //     <div style={{ marginBottom: "30px" }}>
  //       <label htmlFor="numSeats" style={{ fontSize: "18px", color: "#333" }}>
  //         Number of Seats:
  //       </label>
  //       <input
  //         style={{
  //           height: "30px",
  //           marginLeft: "10px",
  //           border: "1px solid #ccc",
  //           borderRadius: "5px",
  //           paddingLeft: "5px",
  //         }}
  //         type="number"
  //         id="numSeats"
  //         value={numSeats}
  //         onChange={(e) => setNumSeats(e.target.value)}
  //       />
  //       <button
  //         style={{
  //           backgroundColor: "#333",
  //           color: "white",
  //           width: "140px",
  //           marginLeft: "10px",
  //           height: "32px",
  //           border: "none",
  //           borderRadius: "5px",
  //           cursor: "pointer",
  //         }}
  //         onClick={reserveSeats}
  //       >
  //         Reserve Seats
  //       </button>
  //       <button
  //         style={{
  //           backgroundColor: "#FFA500",
  //           width: "140px",
  //           marginLeft: "10px",
  //           height: "32px",
  //           border: "none",
  //           borderRadius: "5px",
  //           cursor: "pointer",
  //         }}
  //         onClick={resetSeats}
  //       >
  //         Reset Seats
  //       </button>
  //     </div>
  //     <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(6, 1fr)",
  //           gap: "10px",
  //           alignItems: "center",
  //         }}
  //       >
  //         {seats.map((seat) => (
  //           <div
  //             key={seat._id}
  //             style={{
  //               width: "40px",
  //               height: "40px",
  //               backgroundColor: seat.isBooked ? "#ADFF2F" : "#FFD700",
  //               borderRadius: "50%",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               fontWeight: "bold",
  //               fontSize: "18px",
  //               color: "#333",
  //             }}
  //           >
  //             {seat.seatNumber}
  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
  //           <h4 style={{ marginRight: "5px", color: "#555" }}>Booked Seats No: </h4>
  //           {book.map((el, index) => (
  //             <p
  //               key={index}
  //               style={{
  //                 margin: 0,
  //                 color: "#555",
  //                 fontSize: "16px",
  //                 fontWeight: "500",
  //               }}
  //             >
  //               {el}
  //             </p>
  //           ))}
  //         </div>
  //         <div>
  //           <h4 style={{ color: "red", margin: 0 }}>{msg}</h4>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div style={{ textAlign: "center", padding: "50px" }}>
  //     <h1 style={{ marginBottom: "20px", color: "#333" }}>
  //       Unstop Seat Reservation Assignment
  //     </h1>
  //     <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
  //       <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "#FFD700",
  //             marginRight: "10px",
  //           }}
  //         ></div>
  //         <div style={{ color: "#333" }}>Vacant Seats</div>
  //       </div>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "#ADFF2F",
  //             marginRight: "10px",
  //           }}
  //         ></div>
  //         <div style={{ color: "#333" }}>Booked Seats</div>
  //       </div>
  //     </div>
  //     <div style={{ marginBottom: "20px" }}>
  //       <label htmlFor="numSeats" style={{ fontSize: "20px", color: "#333" }}>
  //         Number of Seats:
  //       </label>
  //       <input
  //         style={{
  //           height: "28px",
  //           marginLeft: "10px",
  //           border: "1px solid #ccc",
  //           borderRadius: "3px",
  //           paddingLeft: "5px",
  //         }}
  //         type="number"
  //         id="numSeats"
  //         value={numSeats}
  //         onChange={(e) => setNumSeats(e.target.value)}
  //       />
  //       <button
  //         style={{
  //           backgroundColor: "#333",
  //           color: "white",
  //           width: "150px",
  //           marginLeft: "10px",
  //           height: "30px",
  //           border: "none",
  //           borderRadius: "3px",
  //           cursor: "pointer",
  //         }}
  //         onClick={reserveSeats}
  //       >
  //         Reserve Seats
  //       </button>
  //       <button
  //         style={{
  //           backgroundColor: "#FFA500",
  //           width: "150px",
  //           marginLeft: "10px",
  //           height: "30px",
  //           border: "none",
  //           borderRadius: "3px",
  //           cursor: "pointer",
  //         }}
  //         onClick={resetSeats}
  //       >
  //         Reset Seats
  //       </button>
  //     </div>
  //     <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(6, 1fr)",
  //           gap: "10px",
  //           alignItems: "center",
  //         }}
  //       >
  //         {seats.map((seat) => (
  //           <div
  //             key={seat._id}
  //             style={{
  //               width: "30px",
  //               height: "30px",
  //               backgroundColor: seat.isBooked ? "#ADFF2F" : "#FFD700",
  //               borderRadius: "50%",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               fontWeight: "bold",
  //               color: "#333",
  //             }}
  //           >
  //             {seat.seatNumber}
  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
  //           <h4 style={{ marginRight: "5px", color: "#333" }}>Booked Seats No: </h4>
  //           {book.map((el, index) => (
  //             <p key={index} style={{ margin: 0, color: "#333" }}>
  //               {el}
  //             </p>
  //           ))}
  //         </div>
  //         <div>
  //           <h4 style={{ color: "red", margin: 0 }}>{msg}</h4>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div style={{ textAlign: "center", padding: "50px" }}>
  //     <h1 style={{ marginBottom: "20px" }}>Unstop Seat Reservation Assignment</h1>
  //     <div style={{ marginBottom: "20px" }}>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "yellow",
  //             marginRight: "10px",
  //           }}
  //         ></div>
  //         <div>Vacant Seats</div>
  //       </div>
  //       <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             backgroundColor: "greenyellow",
  //             marginRight: "10px",
  //           }}
  //         ></div>
  //         <div>Booked Seats</div>
  //       </div>
  //     </div>
  //     <div style={{ marginBottom: "20px" }}>
  //       <label htmlFor="numSeats" style={{ fontSize: "20px" }}>
  //         Number of Seats:
  //       </label>
  //       <input
  //         style={{ height: "28px", marginLeft: "10px" }}
  //         type="number"
  //         id="numSeats"
  //         value={numSeats}
  //         onChange={(e) => setNumSeats(e.target.value)}
  //       />
  //       <button
  //         style={{
  //           backgroundColor: "black",
  //           color: "white",
  //           width: "150px",
  //           marginLeft: "10px",
  //           height: "30px",
  //         }}
  //         onClick={reserveSeats}
  //       >
  //         Reserve Seats
  //       </button>
  //       <button
  //         style={{
  //           backgroundColor: "orange",
  //           width: "150px",
  //           marginLeft: "10px",
  //           height: "30px",
  //         }}
  //         onClick={resetSeats}
  //       >
  //         Reset Seats
  //       </button>
  //     </div>
  //     <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(6, 1fr)",
  //           gap: "10px",
  //           alignItems: "center",
  //         }}
  //       >
  //         {seats.map((seat) => (
  //           <div
  //             key={seat._id}
  //             style={{
  //               width: "30px",
  //               height: "30px",
  //               backgroundColor: seat.isBooked ? "greenyellow" : "yellow",
  //             }}
  //           >
  //             <p style={{ margin: 0, fontSize: "12px" }}>{seat.seatNumber}</p>
  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
  //           <h4 style={{ marginRight: "5px" }}>Booked Seats No: </h4>
  //           {book.map((el, index) => (
  //             <p key={index} style={{ margin: 0 }}>
  //               {el}
  //             </p>
  //           ))}
  //         </div>
  //         <div>
  //           <h4 style={{ color: "red", margin: 0 }}>{msg}</h4>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div
  //     style={{
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       flexDirection: "column",
  //       marginBottom: "50px",
  //     }}
  //   >
  //     <h1>Unstop Seat Reservation Assignment</h1>
  //     <div style={{ marginBottom: "15px" }}>
  //       <div style={{ display: "flex" }}>
  //         <div
  //           style={{ width: "30px", height: "30px", backgroundColor: "yellow" }}
  //         ></div>
  //         <div>-Vacant Seats</div>
  //       </div>
  //       <div style={{ display: "flex" }}>
  //         <div
  //           style={{
  //             width: "30px",
  //             height: "30px",
  //             backgroundColor: "greenyellow",
  //           }}
  //         ></div>
  //         <div>-Booked Seats</div>
  //       </div>
  //     </div>
  //     <div>
  //       <label htmlFor="numSeats" style={{ fontSize: "25px" }}>
  //         Number of Seats:
  //       </label>
  //       <input
  //         style={{ height: "38px" }}
  //         type="number"
  //         id="numSeats"
  //         value={numSeats}
  //         onChange={(e) => setNumSeats(e.target.value)}
  //       />
  //       <button
  //         style={{
  //           color: "black",
  //           width: "200px",
  //           marginLeft: "5px",
  //           height: "40px",
  //           fontSize: "25px",
  //         }}
  //         onClick={reserveSeats}
  //       >
  //         Reserve Seats
  //       </button>
  //       <button
  //         style={{
  //           color: "orange",
  //           width: "200px",
  //           marginLeft: "10px",
  //           height: "40px",
  //           fontSize: "25px",
  //         }}
  //         onClick={resetSeats}
  //       >
  //         Reset Seats
  //       </button>
  //     </div>
  //     <div style={{ display: "flex", gap: "50px" }}>
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(7,1fr)",
  //           gap: "10px",
  //           marginTop: "50px",
  //           alignItems: "center",
  //         }}
  //       >
  //         {seats.map((seat) => (
  //           <div
  //             key={seat._id}
  //             style={{
  //               width: "40px",
  //               height: "40px",
  //               backgroundColor: seat.isBooked ? "greenyellow" : "yellow",
  //             }}
  //           >

  //             <p>{seat.seatNumber}</p>

  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
  //           <h4> Booked Seats No:-</h4>
  //           {book.map((el) => (
  //             <p>{el}</p>
  //           ))}
  //         </div>

  //         <div>
  //           <h4 style={{ color: "red" }}>{msg}</h4>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Reservation;
