import { TokenPayLoad } from '~/models/request/User.request'
import { databaseService } from './databases.service'
import { Request } from 'express'
import sharp from 'sharp'
import { getName, uploadFile, upload_dir } from '~/utills/file'
import { ObjectId } from 'mongodb'
import fs from 'fs'
class MediaService {
  async handleUploadFile(req: Request) {
    // const { user_id } = req.decoded_access_token as TokenPayLoad

    const files = await uploadFile(req)
    const total = files.map(async (file) => {
      const newName = getName(file.newFilename)
      sharp.cache({ files: 0 })
      await sharp(file.filepath).jpeg().toFile(`${upload_dir}/${newName}.jpg`)
      databaseService.medias.insertOne({
        url: newName
      })

      return {
        url: `http://localhost:8080/static/${newName}.jpg`,
        name: newName
      }
    })
    const result = await Promise.all(total)
    return result
  }
}

export const mediaServices = new MediaService()
