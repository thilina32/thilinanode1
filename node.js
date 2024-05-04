const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://thilina-52f9f.appspot.com",
});

const bucket = admin.storage().bucket();

const fs = require('fs');
const ytdl = require('ytdl-core');

// YouTube video URL
const videoUrl = 'https://www.youtube.com/watch?v=TJ-WCWsYpIk';
const filename =  Date.now()+'.mp4'
const localFilePath = './'+filename;
const videoquality = '18'
const destinationPathInStorage = filename; // Specify the path in Firebase Storage       


// upload video
async function uploadFile(localFilePath, destinationPathInStorage) {
    try {
      await bucket.upload(localFilePath, {
        destination: destinationPathInStorage,
      });
      console.log("File uploaded successfully.");
      
    } catch (error) {
      console.error("Error uploading file:", error);
    }
}


// Download video
ytdl(videoUrl,{ quality: videoquality })
  .pipe(fs.createWriteStream(localFilePath))
  .on('finish', () => {
    console.log('Video downloaded successfully');
    uploadFile(localFilePath, destinationPathInStorage);
  })
  .on('error', err => {
    console.error('Error downloading video:', err);
  });

