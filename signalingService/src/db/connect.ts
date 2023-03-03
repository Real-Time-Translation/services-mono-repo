import {Db, MongoClient} from 'mongodb'

const DBHost = process.env.DB_HOST as string
const DBName = process.env.DB_NAME as string

export const connectToDBServer = async (): Promise<Db | null> => {
    try {
        const client: MongoClient = await new MongoClient(DBHost)
        return client.db(DBName)
    }
    catch (e){
        console.error(e)
        return null
    }
}
