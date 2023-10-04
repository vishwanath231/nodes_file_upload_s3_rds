import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';

const home = asyncHandler(async (req, res) => {
    res.render('index')
})

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const extensionCheck = (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
        cb(null, true);
    } else {
        return cb({
            code:'FILE_EXTENSION'
        });
    }
};

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
            })
        } else if (err?.code === 'LIMIT_FILE_SIZE'){
            res.send({
                code: 400,
                message: 'File size must be less then 2MB'
            })
        }else{
            res.send({
                code: 200,
                message: 'Resume Uploaded!'
            })
        }
        
    
    }));

});


export{ 
    home,
    jobForm
}