const admin = require("firebase-admin");
const ytdl = require("ytdl-core");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://thilina-52f9f.appspot.com", // Replace with your Firebase Storage bucket URL
  databaseURL: "https://thilina-52f9f-default-rtdb.firebaseio.com/" // Replace with your Firebase Database URL

});
const bucket = admin.storage().bucket();
const db = admin.database();


db.ref('id/').on("value", function(snapshot) {
    console.log(snapshot.val());
});
