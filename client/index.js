'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})

const berlin = 'fb7aadac-bded-4321-9223-e3c30c5e3ba5'

mapboxgl.accessToken = process.env.MAPBOX_TOKEN

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9',
	zoom: 13,
	hash: true,
	center: [13.386, 52.518]
})

fetch('scooters.json', {
	mode: 'cors',
	redirect: 'follow'
})
.then((res) => {
	if (!res.ok) {
		const err = new Error(res.statusText)
		err.statusCode = res.status
		throw err
	}
	return res.json()
})
.then((data) => {
	console.log(data) // todo: create layer, show data
})
.catch(console.error) // todo
