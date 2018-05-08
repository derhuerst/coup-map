'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})

const berlin = 'fb7aadac-bded-4321-9223-e3c30c5e3ba5'
const upstream = `http://app.joincoup.com//api/v3/markets/${berlin}/scooters.json`

const fetchScooters = () => {
	return fetch(upstream, {
		mode: 'cors',
		redirect: 'follow'
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = 502
			throw err
		}
		return res.json()
	})
	.then(result => result.data.scooters)
}

module.exports = fetchScooters
