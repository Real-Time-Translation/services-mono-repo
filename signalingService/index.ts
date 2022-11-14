import express, {Express, Request} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app: Express = express();
app.use(cors())

const PORT = process.env.PORT;

app.get('/', (req: Request, res)=>{
    res.send('hello from signalling service')
});

app.listen(PORT,()=> {
    console.log('Server is running in port' , PORT)
});