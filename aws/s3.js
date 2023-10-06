import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.BUCKET_REGION
});


export function uploadFile(fileBuffer, fileName, mimetype) {

    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
    }

    return s3Client.send(new PutObjectCommand(uploadParams));
}


export async function getObjectSignedUrl(key) {

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    }

    const command = new GetObjectCommand(params);
    const seconds = 604800;


    const url = await  getSignedUrl(s3Client, command, { expiresIn: seconds });

    return url;
}


