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
    console.log('loding...')
    const now = Date.now();
    const filePath = now + "video.mp4";
    ytdl(data2['url'], { quality: data2['q'] })
    .pipe(fs.createWriteStream(filePath))
    .on("finish", () => {
        console.log("Video downloaded successfully.");

        // Upload video to Firebase Storage
        const fileName =  now+"video.mp4";
        const destination = `videos/${fileName}`;

        bucket.upload(filePath, { destination })
        .then((uploadResponse) => {
            console.log("Video uploaded to Firebase Storage successfully.");

            // Get the uploaded file
            const uploadedFile = uploadResponse[0];

            // Get a signed URL for the file with a longer expiration period
            uploadedFile.getSignedUrl({
            action: 'read',
            expires: '01-01-2050' // or set a date far in the future
            })
            .then((signedUrl) => {
                console.log("URL of the uploaded video:", signedUrl);
                const urldata = {}
                urldata[now] = {
                    url:signedUrl,
                    name:data2['name']
                }
                db.ref("video/data")
                .update(urldata)
                .then(() => {
                    console.log("Data set successfully.");
                })
                .catch((error) => {
                    console.error("Error setting data:", error);
                });
            })
            .catch((error) => {
                console.error("Error generating signed URL:", error);
            });

            // Delete the local file
            fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("Local file deleted successfully:", filePath);
            }
            });
        })
        .catch((error) => {
            console.error("Error uploading video to Firebase Storage:", error);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log("Local file deleted successfully:", filePath);
                }
            });
        });
    })
    .on("error", (error) => {
        console.error("Error downloading video:", error);
    });
});
