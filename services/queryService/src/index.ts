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

/** Initializing core servers */
const app: Express = express();
const server: HTTPServer = createServer(app);
export const socketIO = createSocketIO(server);

/** Set middlewares */
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


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

/** Perform nessesary connections to DB and Message Broker*/
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

/** Testing translation to redirect to Yandex Translate API */
app.post('/translate', (req: Request, res: Response) => {
    const textToTranslate = req.body.text
    const sourceLanguage = req.body.sourceLanguage
    const currentLanguage = req.body.currentLanguage
    fetch('https://translate.api.cloud.yandex.net/translate/v2/translate',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    'Bearer t1.9euelZrNj42Om8nLnpmQzcnPy8qNne3rnpWak4nKmZGVx5eNnJGVlIyeiZvl8_c4HiFc-e8DAhxx_N3z93hMHlz57wMCHHH8.q8hcqWW1QN2Cqc6llJ18NSRp2T8wXfIz0XkkzIbbsZpeBs6CoymI-Zw0D0knSZ1OUjv9EZXfnxYXs2e7bGOaCw',
            },
            body: JSON.stringify({
                "folderId": "b1gq2t56gg8ujf82elrj",
                "sourceLanguageCode": sourceLanguage,
                "targetLanguageCode": currentLanguage,
                "texts": [
                    textToTranslate
                ]
            })
        }
    ).then((resultFromAPI: any) => {
        resultFromAPI.json().then((parsedData: any) => {
            try {
                const translatedText = parsedData.translations[0].text
                res.send(translatedText).status(200);
            } catch (e) {
                res.send('error in Yandex Translate API').status(500);
            }
        })
    })
})