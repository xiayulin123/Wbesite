var mysql = require('mysql2');

// know how to integrate components into server file
// know how to connect to a database
// having different query

function insertReserveData(data, done) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  con.connect(function (err) {
    if (err) return done(new Error('connection failed'));
    var sqlquery = "INSERT INTO Reservation VALUES(\'" + data.body.ReservationName + "\',\'" +
      data.body.PhoneNumber + "\'," + data.body.GroupSize + ",\'" +
      data.body.ReservationDate + "\',\'" + data.body.ReservationMessages + "\');";

    con.query(sqlquery, function (err, result) {
      if (err) return done(new Error('Insertion failed'));
      console.log("Successfully Inserted");
      return done(null);
    });
  });
}

async function fetchAllReserveData() {
  var con = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  console.log("Fectching all data");

  return new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM Reservation;",
      function (err, result) {
        if (result === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(result);
        }
      }
    )
  }
  );
}

async function fetchOneReserveData(data) {
  var con = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  return new Promise(function (resolve, reject) {
    var sqlquery = "SELECT * FROM Reservation WHERE (ReservationName=\'" + data.query.ReservationName +
      "\' AND PhoneNumber=\'" + data.query.PhoneNumber +
      "\' AND ReservationDate=\'" + data.query.ReservationDate + "\');";

    con.query(
      sqlquery,
      function (err, result) {
        if (result === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(result);
        }
      }
    )
  }
  );
}

async function fetchReserveDataByDate(data) {
  var con = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  return new Promise(function (resolve, reject) {
    var sqlquery = "SELECT * FROM Reservation WHERE ReservationDate LIKE \'" + data.query.ReservationDate + "%\';";

    con.query(
      sqlquery,
      function (err, result) {
        if (result === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(result);
        }
      }
    )
  }
  );
}

async function deleteReservation(data) {
  var con = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  return new Promise(function (resolve, reject) {
    var sqlquery = "DELETE FROM Reservation WHERE (ReservationName=\'" + data.body.ReservationName +
      "\' AND PhoneNumber=\'" + data.body.PhoneNumber +
      "\' AND ReservationDate=\'" + data.body.ReservationDate + "\');";

    con.query(
      sqlquery,
      function (err, result) {
        if (result === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(result);
        }
      }
    )
  }
  );

}

async function updataReservation(data) {
  var con = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db"
  });

  return new Promise(function (resolve, reject) {
    var sqlquery = "UPDATE Reservation SET ReservationDate =\'" + data.body.ReservationDate +
      "\' WHERE (ReservationName=\'" + data.body.ReservationName +
      "\' AND PhoneNumber=\'" + data.body.PhoneNumber + "\');";
    console.log(sqlquery);
    con.query(
      sqlquery,
      function (err, result) {
        if (result === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(result);
        }
      }
    )
  }
  );

}
module.exports = {
  insertReserveData,
  fetchAllReserveData,
  fetchOneReserveData,
  fetchReserveDataByDate,
  deleteReservation,
  updataReservation
};