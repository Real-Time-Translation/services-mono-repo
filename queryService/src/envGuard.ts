import dotenv from "dotenv";

export const envGuard = () => {
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config();
    }

    if (!process.env.PORT) {
        throw new Error('Please, specify port number!')
    }
    if (!process.env.DB_HOST) {
        throw new Error('Please, specify DB connection string!')
    }
    if (!process.env.DB_NAME) {
        throw new Error('Please, specify DB connection string!')
    }
    if (!process.env.USER_SERVICE_HOST) {
        throw new Error('Please, specify user service host number!')
    }

    if (!process.env.RABBIT) {
        throw new Error('Please, specify RabbitMQ service host!')
    }
}
