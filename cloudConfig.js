const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary with your Vercel/Local environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Custom Middleware: Uploads a memory buffer directly to Cloudinary
const uploadToCloudinary = (req, res, next) => {
    // If the user didn't upload an image, just move to the next function
    if (!req.file) {
        return next();
    }

    // Create an upload stream to your Cloudinary folder
    const stream = cloudinary.uploader.upload_stream(
        { folder: 'wanderlust_DEV' }, // Change this if your folder is named differently
        (error, result) => {
            if (error) return next(error);

            // MAGIC TRICK: We attach the Cloudinary URLs back onto the req.file object.
            // This perfectly mimics the old package, meaning you DO NOT have to 
            // change any code inside your controllers!
            req.file.path = result.secure_url;
            req.file.filename = result.public_id;

            next(); // Move to your controller
        }
    );

    // Convert the file buffer in RAM into a stream and send it
    streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { cloudinary, uploadToCloudinary };