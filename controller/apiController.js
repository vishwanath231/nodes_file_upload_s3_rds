import asyncHandler from 'express-async-handler';
import multer from 'multer';
import crypto from 'crypto';
import { uploadFile, getObjectSignedUrl } from '../aws/s3.js'
import { mysqlConnection } from '../database/mysql.js';


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

            const { username, email, job_name, job_experience } = req.body;

            // upload file in s3
            const result = await uploadFile(buffer, fileName, mimetype);

            if(result.$metadata.httpStatusCode === 200){

                const uploadUrl = await getObjectSignedUrl(fileName);

                if(uploadUrl){

                    mysqlConnection.query("INSERT INTO job_bucket (username,email,job_name,job_experience, resume) VALUES (?,?,?,?,?)", [username, email, job_name, job_experience, uploadUrl],
                    (err, result) => {
                        if (err) throw new Error('Failed into insert data!');

                        res.send({
                            code: 200,
                            message: 'Submitted successfull!'
                        })
                    })
                }
            }
        }
    }));
});


const getMysqlData = asyncHandler(async(req, res) => {

   
    mysqlConnection.query("select * from job_bucket",
    (err, result) => {
        if (err) throw new Error('Failed to retrive data');

        res.send(result);
    });
        
}); 


export{ 
    home,
    jobForm,
    getMysqlData
}
