import asyncHandler from 'express-async-handler';
import multer from 'multer';
import crypto from 'crypto';
import { uploadFile } from '../aws/s3.js'


const home = asyncHandler(async (req, res) => {
    res.render('index')
})


const storage = multer.memoryStorage();

const extensionCheck = (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
        cb(null, true);
    } else {
        return cb({
            code:'FILE_EXTENSION'
        });
    }
};


const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


const jobForm =  asyncHandler(async (req, res) => {

    let upload = multer({ 
        storage: storage, 
        fileFilter: extensionCheck,
        limits: {
            fileSize: 2 * 1024 * 1024
        }
    }).single('resume');
    
    upload(req, res, asyncHandler(async (err) => {
        
        if (err?.code === 'FILE_EXTENSION') {

            res.send({
                code: 400,
                message: 'Only PDF file are allowed!'
            });

        } else if (err?.code === 'LIMIT_FILE_SIZE'){

            res.send({
                code: 400,
                message: 'File size must be less then 2MB'
            });

        }else{

            const buffer = req.file.buffer;
            const fileName = randomImageName();
            const mimetype = req.file.mimetype;

            // upload file in s3
            const result = await uploadFile(buffer, fileName, mimetype)

            
            if(result.$metadata.httpStatusCode === 200){
                res.send({
                    code: 200,
                    message: 'Resume Uploaded!'
                })
            }
        }
        
    
    }));

});


export{ 
    home,
    jobForm
}