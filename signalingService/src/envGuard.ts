import dotenv from "dotenv";

export const envGuard = () => {
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config();
    }

    if (!process.env.PORT) {
        throw new Error('Please, specify port number!')
    }
    if (!process.env.DB_HOST) {
        throw new Error('Please, specify DB connection host!')
    }
    if (!process.env.DB_NAME) {
        throw new Error('Please, specify DB connection name!')
    }
    if (!process.env.RABBIT) {
        throw new Error('Please, specify RabbitMQ service host!')
    }
}
