import express, {Express} from 'express'
import cors from 'cors'
import {ConsumeMessage} from 'amqplib'
import {createServer, Server as HTTPServer} from 'http';
import {envGuard} from "./envGuard.js";
import {connectRabbit, RaabbitQueue, rabbitMQChannel} from "./rabbit/connect.js";
import {connectToDBServer} from "./db/connect.js";
import {meetingEventConsumer} from "./rabbit/consumers/index.js";

envGuard()
const PORT = process.env.PORT;
const app: Express = express();
const server: HTTPServer = createServer(app);

app.use(cors());
app.use(express.json());

const startServer = () => {
    server.listen(PORT, () => {
        console.log('Signalling service is running...');
    });

    rabbitMQChannel?.channel?.consume(RaabbitQueue.MeetingEvent, (message: ConsumeMessage | null) =>
        meetingEventConsumer(message)
    )

};

Promise.all([connectRabbit(), connectToDBServer()]).then((values) => {
    const dbConnectionResult = values[1];
    console.log('connected to db', dbConnectionResult.databaseName)
    console.log('connected to rabbitmq')
    startServer();
});