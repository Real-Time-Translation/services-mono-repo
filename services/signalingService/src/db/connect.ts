import {Db, MongoClient} from 'mongodb'

const DBHost = process.env.DB_HOST as string
const DBName = process.env.DB_NAME as string

type DBConnection = {
    db: Db | null
}

export const dbConnection: DBConnection = {
    db: null
}

export const connectToDBServer = (): Promise<Db> => {
    return new Promise((resolve, reject) => {
        try {
            const client: MongoClient = new MongoClient(DBHost)
            client.connect().then(async mongoClient=>{
                const signallingServiceDatabase = mongoClient.db(DBName);
                dbConnection.db = signallingServiceDatabase
                dbConnection.db.collection("meetings");
                await dbConnection.db.command({ping: 1})
                resolve(signallingServiceDatabase)
            })
        }
        catch (e){
            reject(e)
        }
    })
}
