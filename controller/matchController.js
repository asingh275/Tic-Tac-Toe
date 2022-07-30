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

const getAllMatches = (req, res, next)=> {
    const userString = "matches/";
    firebaseDB.get(
        firebaseDB.child(firebaseDB.ref(database), userString)
    ).then((snapshot) => {
        let matches = snapshot.exportVal();
        if(matches === null){
            matches = {};
        }
        res.set('content-location',`/api/v1/match`).json({
            url:  `/api/v1/match`,
            data: Object.getOwnPropertyNames(matches)
        }).status(201)
    }).catch((error) => {
        res.json({
            message: "Encounter an error while fetching all matches",
            error: error
        }).status(500)
    });
}

const getMatchById = (req, res, next)=> {
    const {gameID} = req.params;
    const userString = `matches/${gameID}`;
    firebaseDB.get(
        firebaseDB.child(firebaseDB.ref(database), userString)
    ).then((snapshot) => {
        let match = snapshot.exportVal();
        let location = `/api/v1/match/${gameID}`;
        if(match === null){
            match = {};
            location = `/api/v1/match/`;
        }
        res.set('content-location',`${location}`).json({
            url:  `${location}`,
            data: match
        }).status(201)
    }).catch((error) => {
        res.json({
            message: "Encounter an error while match",
            error: error
        }).status(500)
    });
}


const addMatch = async (req, res, next) => {
  const {
    player1Name,
    player1ID,
    player2Name,
    player2ID,
    player1Wins,
    player2Wins,
    gameID,
  } = req.body;
  firebaseDB
    .set(firebaseDB.ref(database, "matches/" + gameID), {
      gameID,
      player1Name,
      player1ID,
      player2Name,
      player2ID,
      player1Wins,
      player2Wins,
    })
    .then(() => {
        res.set('content-location',`/api/v1/match/${gameID}`).json({
            url:  `/api/v1/match/${gameID}`,
            data: {
                player1Name,
                player1ID,
                player2Name,
                player2ID,
                player1Wins,
                player2Wins,
                gameID,
              }
        }).status(201)
    })
    .catch((error) => {
        res.json({
            message: "Encounter an error while adding match",
            error: error
        }).status(500)
    });
};

module.exports = { addMatch, getAllMatches, getMatchById };
