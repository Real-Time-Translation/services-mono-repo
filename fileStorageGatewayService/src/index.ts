import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import s3 from './s3StorageApi/index.js'

if (process.env.NODE_ENV !== 'production'){
    dotenv.config()
}

if (!process.env.PORT) {
    throw new Error('Please, specify port number!')
}

const app: Express = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

app.get('/', (req:Request, res:Response)=>{
    res.send('hello from file service')
});

/**
 * TODO:
 *  - Leave the dump logic, specific for images transfer
 *  - Extend get req params and API
 *  - API tests
 * */
app.get('/file', async (req:Request, res:Response)=>{
    try{
        const path = req.query.path
        const fileData = await s3.Download(path)
        const file = fileData.data
        const b64Data = Buffer.from(file.Body).toString('base64');
        res.status(200).send(b64Data)
    }
    catch (e) {
        res.status(500).json(e)
    }
})


app.listen(PORT,()=> {
    console.log('Server is running in port:' , PORT)
});