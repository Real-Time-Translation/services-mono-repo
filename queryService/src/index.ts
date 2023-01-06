import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from "axios";

if (process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

if (!process.env.PORT) {
    throw new Error('Please, specify port number!')
}

if (!process.env.USER_SERVICE_HOST) {
    throw new Error('Please, specify user service host number!')
}

const app: Express = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;
const USER_SERVICE = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`
console.log(USER_SERVICE)
app.get('/', (req:Request, res:Response)=>{
    res.send('hello from query service' +
        '')
});

app.get('/user-check', (req:Request, res:Response)=>{
    axios.get(USER_SERVICE).then(()=> {
        res.send('ok')
    })
});

app.listen(PORT,()=> {
    console.log('Server is running in port:' , PORT)
});