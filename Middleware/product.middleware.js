import multer from 'multer';

/*
NOTE:
When sending both JSON data and an image file using multipart/form-data in Postman,
the text fields (like "productData") are stored in req.body, and the files are stored in req.files
(or req.file for a single file).
*/

const upload = multer();

/**[MIDDLEWARE]: pass product image <check exist-size 100mb> and pass product data */
const passProductData = (req, res, next) => {
    
    // Multer middleware to handle image and JSON data
    const uploadedFields = upload.fields([
        { name: "productImg", maxCount: 1 },
        { name: "productData", maxCount: 1 }
    ]);

    uploadedFields(req, res, (err) => {
        if (err) {
            return res.status(400).json({ err: err.message }); // Return error properly
        }

        // CHECK IMAGE EXISTS
        if (!req.files || !req.files.productImg) {
            return res.status(400).json({ msg: "NO IMAGE UPLOADED" });
        }

        // CHECK IMAGE SIZE (100 MB)
        const maxSize = 100 * 1024 * 1024;
        if (req.files.productImg[0].size > maxSize) {
            return res.status(400).json({ msg: "Exceeded the max size of image (more than 100 MB)" });
        }

        // CONVERT JSON DATA
        try {
            req.body = JSON.parse(req.body.productData); // Convert productData from string to JSON
        } catch (error) {
            return res.status(400).json({ msg: "Invalid JSON format in productData" });
        }

        next(); // Proceed to the next middleware/controller
    });
};

export default passProductData;
