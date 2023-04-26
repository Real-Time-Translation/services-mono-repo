import express, {Express, Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {ConsumeMessage} from 'amqplib'
import {createServer, Server as HTTPServer} from 'http';
import {envGuard} from "./envGuard.js";
import {connectRabbit, RaabbitQueue, rabbitMQChannel} from "./rabbit/connect.js";
import {connectToDBServer} from "./db/connect.js";
import {createSocketIO, listenEvents as listenClientEvents} from "./socket/index.js";
import {meetingEventConsumer} from "./rabbit/consumers/index.js";
import fetch from "node-fetch";

envGuard()
const PORT = process.env.PORT;
const app: Express = express();
const server: HTTPServer = createServer(app);
export const socketIO = createSocketIO(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const startServer = () => {
    server.listen(PORT, () => {
        console.log('Query service is running...');
    });

    rabbitMQChannel?.channel?.consume(RaabbitQueue.MeetingEventAware,
        (message: ConsumeMessage | null) =>
            meetingEventConsumer(message)
    )
    listenClientEvents()
};

Promise.all([connectRabbit(), connectToDBServer()]).then((values) => {
    const dbConnectionResult = values[1];
    console.log('connected to db', dbConnectionResult.databaseName)
    console.log('connected to rabbitmq')
    startServer();
});

/** Handlers */
app.get('/', (req: Request, res: Response) => {
    res.send('hello from query service 1').status(200);
});

app.post('/translate', (req: Request, res: Response) => {
    const textToTranslate = req.body.text
    fetch('https://translate.api.cloud.yandex.net/translate/v2/translate',
        {method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    'Bearer t1.9euelZqNz8fHjcuJzpaRipeVm5bOj-3rnpWak4nKmZGVx5eNnJGVlIyeiZvl8_drZVld-e9bWHE5_N3z9ysUV13571tYcTn8.zGr8sk9pEQncau_jcfl7lckmu1uFNaJNJGRHsvt55L66kao6bg-SHeQPw9dFVqbV2MHf2_UYn7rKuiX6PS40Cg',
            },
            body: JSON.stringify({
                "folderId": "b1gq2t56gg8ujf82elrj",
                "sourceLanguageCode": "ru",
                "targetLanguageCode": "en",
                "texts": [
                    textToTranslate
                ]
            })
        }
    ).then((resultFromAPI: any) => {
        resultFromAPI.json().then((parsedData: any) => {
            const translatedText = parsedData.translations[0].text
            res.send(translatedText).status(200);
        })
    })
})