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


db.ref('url/').on("value", function(snapshot) {
    const data2 = snapshot.val();
    const now = Date.now();
    const filePath = now + "video.mp4";
    ytdl(data2['url'])
    .pipe(fs.createWriteStream(filePath))
    .on("finish", () => {
        console.log("Video downloaded successfully.");

        // Upload video to Firebase Storage
        const fileName =  now+"video.mp4";
        const destination = `videos/${fileName}`;

        bucket.upload(fileName, { destination })
        .then(() => {
            console.log("Video uploaded to Firebase Storage successfully.");
            fs.unlink(filePath, (err) => {
                if (err) {
                  console.error("Error deleting file:", err);
                } else {
                  console.log("File deleted successfully:", filePath);
                }
              });
        })
        .catch((error) => {
            console.error("Error uploading video to Firebase Storage:", error);
            fs.unlink(filePath, (err) => {
                if (err) {
                  console.error("Error deleting file:", err);
                } else {
                  console.log("File deleted successfully:", filePath);
                }
            });
        });
    })
    .on("error", (error) => {
        console.error("Error downloading video:", error);
    });
    console.log(snapshot.val());
});
