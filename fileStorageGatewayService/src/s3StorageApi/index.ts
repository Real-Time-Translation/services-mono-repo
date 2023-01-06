// @ts-ignore Library does not have any declaration files and @types/ lib
import EasyYandexS3 from 'easy-yandex-s3';
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

if (!process.env.YSTORAGE_ACCESS_KEY_ID
    || !process.env.YSTORAGE_SECRET_ACCESS_KEY_ID) {
    throw new Error('Please, provide access secrets for Yandex Cloud storage')
}

/**
 * Gateway to proceed CRUD operations with yandex storage
 * */
const s3 = new EasyYandexS3({
    auth: {
        accessKeyId: process.env.YSTORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.YSTORAGE_SECRET_ACCESS_KEY_ID
    },
    Bucket: 'rtt-storage',
    debug: false
})

export default s3