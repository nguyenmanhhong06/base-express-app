import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { User } from '~/models/schemas/User.schema'

const uri = `mongodb+srv://manhhong:123456789a@test.pxyp0xt.mongodb.net/test`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db('your-name-db')
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
    }
  }

  get user(): Collection<User> {
    return this.db.collection('users')
  }
}
export const databaseService = new DatabaseService()
