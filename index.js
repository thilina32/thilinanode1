const admin = require("firebase-admin");
const ytdl = require("ytdl-core");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://thilina-52f9f.appspot.com", // Replace with your Firebase Storage bucket URL
});
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thilina-52f9f-default-rtdb.firebaseio.com/" // Replace with your Firebase Database URL
});
const bucket = admin.storage().bucket();
const db = admin.database();


db.logDatabaseChange = functions.database.ref("/id/")
  .onWrite((change, context) => {
    // Log a notification when a change is made in the database
    console.log("Change detected in Firebase Database:", change.after.val());
    
    // You can also access additional information about the change and context
    // For example:
    // const newValue = change.after.val();
    // const previousValue = change.before.val();
    // const eventId = context.eventId;
    // const timestamp = context.timestamp;
    
    // You can perform additional actions based on the database change here
    
    // Return a result if necessary
    return null;
  });
