import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app: Express = express();
app.use(cors())
app.use(express.json())

if (!process.env.PORT) {
    throw new Error('Please, specify port number')
}
const PORT = process.env.PORT;

app.get('/', (req:Request, res:Response)=>{
    res.send('hello from user service')
});

app.listen(PORT,()=> {
    console.log('Server is running in port' , PORT)
});