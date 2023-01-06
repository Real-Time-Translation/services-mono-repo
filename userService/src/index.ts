import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

if (!process.env.PORT) {
    throw new Error('Please, specify port number!')
}

const app: Express = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;

app.get('/', (req:Request, res:Response)=>{
    res.send('hello from user service' +
        '')
});

app.listen(PORT,()=> {
    console.log('User service is running...')
});