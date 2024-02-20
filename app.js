const express = require('express')
const morgan = require('morgan')
//////////////////////////////////////////////////////
const app = express()
const authRoute = require('./routes/auth')
const AppError = require('./middlewares/AppError')
const globalErrorHandlingMiddleware = require('./controllers/globalHandlerError')
/////////////////////////////////////
// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(express.json())
//////////////////////////////////////////////////////
// Mounting routes

app.use('/api/v1/auth', authRoute)
app.all('*', (req, res, next) => {
	next(new AppError(404, 'this route is not defined'))
})
app.use(globalErrorHandlingMiddleware)
//////////////////////////////////////////////////////
module.exports = app
