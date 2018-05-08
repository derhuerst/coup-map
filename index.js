'use strict'

const path = require('path')
const express = require('express')
const corser = require('corser')
const compression = require('compression')
const serveStatic = require('serve-static')

const fetchScooters = require('./lib/fetch-scooters')

const clientDir = path.join(__dirname, 'client')

const api = express()
api.use(compression())

// CORS proxy
api.get('/scooters', corser.create(), (req, res, next) => {
	fetchScooters()
	.then(data => res.json(data))
	.catch(next)
})

api.use(serveStatic(clientDir))

api.use((err, req, res, next) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	if (res.headersSent) return next()
	res.status(err.statusCode || 500).json({error: true, msg: err.message})
	next()
})

api.listen(process.env.PORT || 3000, (err) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	}
})
