import express, {Express} from 'express'
import cors from 'cors'
import {Channel, ConsumeMessage} from 'amqplib'
import {createServer, Server as HTTPServer} from 'http';
import {envGuard} from "./envGuard.js";
import {connectRabbit} from "./rabbit/connect.js";
import {connectToDBServer} from "./db/connect.js";
import {Db} from "mongodb";
import {meetingQueueConsumer} from "./rabbit/consumers/meetingQueueConsumer.js";

envGuard()
const PORT = process.env.PORT;
const app: Express = express();
const server: HTTPServer = createServer(app);

app.use(cors());
app.use(express.json());

const startServer = (ampqChannel: Channel, db: Db) => {
    server.listen(PORT, () => {
        console.log('Signalling service is running...');
    });

    ampqChannel.consume("CreateMeetingQueue",
        (message: ConsumeMessage | null) => meetingQueueConsumer(message, db));

};

Promise.all([connectRabbit(), connectToDBServer()]).then((values)=>{
    const rabbitConnectionResult = values[0];
    const dbConnectionResult = values[1] as Db;
    startServer(rabbitConnectionResult, dbConnectionResult);
});