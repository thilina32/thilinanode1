const admin = require("firebase-admin");
const ytdl = require("ytdl-core");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://thilina-52f9f.appspot.com", // Replace with your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

// YouTube video URL
const videoUrl = "https://www.youtube.com/watch?v=TJ-WCWsYpIk"; // Replace with the YouTube video ID

// Download video from YouTube
const now = Date.now();
ytdl(videoUrl)
  .pipe(fs.createWriteStream(now+"video.mp4"))
  .on("finish", () => {
    console.log("Video downloaded successfully.");

    // Upload video to Firebase Storage
    const fileName =  now+"video.mp4";
    const destination = `videos/${fileName}`;

    bucket.upload(fileName, { destination })
      .then(() => {
        console.log("Video uploaded to Firebase Storage successfully.");
      })
      .catch((error) => {
        console.error("Error uploading video to Firebase Storage:", error);
      });
  })
  .on("error", (error) => {
    console.error("Error downloading video:", error);
  });
