import express, { NextFunction, Request, Response } from 'express'
import { databaseService } from './services/databases.service'
import usersRouter from './routes/user.route'
import { ErrorWithMessage } from './models/Error'
import cors from 'cors'
import hotelsRouter from './routes/hotel.route'
import mediaRouter from './routes/media.route'
import { initFolder, upload_dir } from './utills/file'
import bookingRouter from './routes/booking.route'
import locationRouter from './routes/location.route'
import transportatitionRouter from './routes/transportation.route'
import bussRouter from './routes/bus.route'
import reviewRouter from './routes/review.route'

const app = express()
const port = 8080
databaseService.connect().catch(console.dir)
app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())
app.use('/users', usersRouter)
app.use('/hotels', hotelsRouter)
app.use('/location', locationRouter)
app.use('/medias', mediaRouter)
app.use('/transportation', transportatitionRouter)
app.use('/booking', bookingRouter)
app.use('/car', bussRouter)
app.use('/review', reviewRouter)
app.use('/static', express.static(upload_dir))
// app.use('/invoices', invoiceRoute)
initFolder()
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithMessage) {
    return res.status(err.status).json(err)
  }
  res.status(500).json({
    message: err.message,
    errorInfo: err
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
