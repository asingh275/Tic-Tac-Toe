require("dotenv").config();
const firebase = require("firebase/app");
const firebaseDB = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyBINe1JWwdULFnBLwPpXbrnOj61QrRBcBI",
  authDomain: "cpsc-2650-final-project.firebaseapp.com",
  databaseURL: "https://cpsc-2650-final-project-default-rtdb.firebaseio.com",
  projectId: "cpsc-2650-final-project",
  storageBucket: "cpsc-2650-final-project.appspot.com",
  messagingSenderId: "974072486977",
  appId: "1:974072486977:web:e6945868bd81b110883ac0",
  measurementId: "G-XSCJ0TXNMT",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebaseDB.getDatabase(app);

const addUser = async (req, res, next) => {
  const { userId, name, email, imageUrl } = req.body;
  if(userId === undefined || name === undefined || email === undefined || imageUrl === undefined){
    res.json({
      message: "Missing required fields",
      error: "Missing required fields"
    }).status(400);
  }else{
    const userString = "users/" + userId;
    firebaseDB
      .get(firebaseDB.child(firebaseDB.ref(database), userString))
      .then((snapshot) => {
        if (snapshot.exists()) {
          res
            .json({
              message: "User already exists",
            })
            .status(409);
        } else {
          firebaseDB
            .set(firebaseDB.ref(database, "users/" + userId), {
              username: name,
              email: email,
              profile_picture: imageUrl,
            })
            .then(() => {
              res
                .set("content-location", `/api/v1/user/${userId}`)
                .json({
                  url: `/api/v1/match/${userId}`,
                  data: {
                    userId,
                    name,
                    email,
                    imageUrl,
                  },
                })
                .status(201);
            })
            .catch((error) => {
              res
                .json({
                  message: "Encounter an error while adding user",
                  error: error,
                })
                .status(500);
            });
        }
      })
      .catch((error) => {
        res
          .json({
            message: "Encounter an error while checking if user already exists",
            error: error,
          })
          .status(500);
      });
  }
};

const getUserById = async (req, res, next) => {
  const { userID } = req.params;
  const userString = `users/${userID}`;
  firebaseDB
    .get(firebaseDB.child(firebaseDB.ref(database), userString))
    .then((snapshot) => {
      let user = snapshot.exportVal();
      let location = `/api/v1/user/${userID}`;
      if (user === null) {
        user = {};
        location = `/api/v1/user/`;
      }
      res
        .set("content-location", `${location}`)
        .json({
          url: `${location}`,
          data: user,
        })
        .status(201);
    })
    .catch((error) => {
      res
        .json({
          message: "Encounter an error while fetching user",
          error: error,
        })
        .status(500);
    });
};

module.exports = { addUser, getUserById };

