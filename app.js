const express = require('express')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const compression = require('compression');
//////////////////////////////////////////////////////
const app = express()
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const reviewRoute = require('./routes/review')
const AppError = require('./middlewares/AppError')
const placeRoute = require('./routes/place')
const favRoute = require('./routes/favorite')
const eventRoute = require('./routes/event')
const tourRoute = require('./routes/tours');
const artifacsRoute = require('./routes/artifacs');
const appRoute = require('./routes/app');
const globalErrorHandlingMiddleware = require('./controllers/globalHandlerError')
/////////////////////////////////////
// Middlewares
app.use(express.json({ limit: '10kb' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'test/view')))

app.use('/placeImages', express.static(path.join(__dirname, 'public/img/places')));
app.use('/userImages', express.static(path.join(__dirname, 'public/img/users')));
app.use('/ar',express.static(path.join(__dirname,'public/ar')));
app.use('/artifacsImages', express.static(path.join(__dirname, 'public/img/Artifacss')));
app.set('trust proxy', true)
app.use(mongoSanitize())
app.use(xss())
app.use(helmet({ contentSecurityPolicy: false }))
const keyGenerator = (req) => {
	return req.ip
}
const limiter = rateLimit({
	window: 60 * 60 * 1000, //1hour
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	keyGenerator,
	message: 'Too many requests from the same IP , try again after 1hour',
})
app.use('/api', limiter)
app.use(compression())

app.set('view engine','ejs');
app.set('views','test');
//////////////////////////////////////////////////////
// Mounting routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/places',placeRoute)
app.use('/api/v1/reviews',reviewRoute)
app.use('/api/v1/favorite',favRoute)
app.use('/api/v1/events',eventRoute)
app.use('/api/v1/tours',tourRoute)
app.use('/api/v1/artifacs',artifacsRoute);
app.use(appRoute)
app.all('*', (req, res, next) => {
	next(new AppError(404, 'this route is not defined'))
})
app.use(globalErrorHandlingMiddleware)
//////////////////////////////////////////////////////
module.exports = app