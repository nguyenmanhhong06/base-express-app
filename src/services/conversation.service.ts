import { ObjectId } from 'mongodb'
import { databaseService } from './databases.service'

class ConversationService {
  async getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const conversations = await databaseService.conversations
      .find(match)
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await databaseService.conversations.countDocuments(match)
    return {
      conversations,
      total
    }
  }
  async getAllMembers(user_id: string) {
    const conversation = await databaseService.conversations
      .aggregate([
        {
          $match: {
            $or: [
              {
                sender_id: new ObjectId(user_id)
              },
              {
                receiver_id: new ObjectId(user_id)
              }
            ]
          }
        },
        {
          $group: {
            _id: '$receiver_id',
            firstRecord: {
              $first: '$$ROOT'
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: '$firstRecord'
          }
        },
        {
          $match: {
            receiver_id: {
              $ne: new ObjectId(user_id)
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'receiver_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $addFields: {
            user: {
              $arrayElemAt: ['$user', 0]
            }
          }
        }
      ])
      .toArray()
    return conversation
  }
}
const conversationService = new ConversationService()
export default conversationService
