import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import {Channel, ConsumeMessage} from 'amqplib'
import {createServer, Server as HTTPServer} from 'http';
import {envGuard} from "./envGuard.js";
import {connectRabbit, RaabbitQueue} from "./rabbit/connect.js";
import {connectToDBServer} from "./db/connect.js";
import {Db} from "mongodb";
import {createSocketIO, listenEvents as listenClientEvents} from "./socket/index.js";
import {meetingCreatedConsumer} from "./rabbit/consumers/meetingCreatedConsumer.js";

envGuard()
const PORT = process.env.PORT;
const app: Express = express();
const server: HTTPServer = createServer(app);
const socketIO = createSocketIO(server);

app.use(cors());
app.use(express.json());

const startServer = (ampqChannel: Channel, db: Db | null) => {
    server.listen(PORT, () => {
        console.log('Query service is running...');
    });

    /** Отслеживание создания комнаты */
    ampqChannel.consume(RaabbitQueue.MeetingCreatedQueue,
        (message: ConsumeMessage | null)  =>
            meetingCreatedConsumer(message, ampqChannel, socketIO));

    listenClientEvents(socketIO, ampqChannel)
};


Promise.all([connectRabbit(), connectToDBServer()]).then((values)=>{
    const rabbitConnectionResult = values[0];
    const dbConnectionResult = values[1];
    startServer(rabbitConnectionResult, dbConnectionResult);
});

/** Handlers */
app.get('/', (req: Request, res: Response) => {
    res.send('hello from query service 1').status(200);
});