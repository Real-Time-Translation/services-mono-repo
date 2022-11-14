import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(cors())

const PORT = process.env.PORT;

app.get('/', (req, res)=>{
    res.send('hello from user service')
});

app.listen(PORT,()=> {
    console.log('Server is running in port' , PORT)
});