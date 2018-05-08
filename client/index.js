'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const omit = require('lodash.omit')
const escapeHtml = require('stringify-entities')

const escape = str => escapeHtml(str, {escapeOnly: true})

const berlin = 'fb7aadac-bded-4321-9223-e3c30c5e3ba5'

mapboxgl.accessToken = process.env.MAPBOX_TOKEN

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9',
	zoom: 13,
	hash: true,
	center: [13.386, 52.518]
})

fetch('scooters', {
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
	const features = data.map((scooter) => {
		return {
			type: 'Feature',
			properties: omit(scooter, ['location']),
			geometry: {
				type: 'Point',
				coordinates: [
					scooter.location.lng,
					scooter.location.lat
				]
			}
		}
	})
	map.addSource('scooters', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features
		}
	})
	map.addLayer({
		id: 'points',
		type: 'circle',
		source: 'scooters',
		paint: {
			'circle-radius': {base: 1.5, stops: [[1, .5], [12, 3], [20, 25]]},
			'circle-color': {
				property: 'energy_level',
				stops: [[0, '#ee2200'], [30, '#eebb00'], [90, '#2ecc71']]
			},
			'circle-stroke-width': .8,
			'circle-stroke-color': '#000'
		}
	})

	map.on('click', (e) => {
		const s = map.queryRenderedFeatures(e.point, {layers: ['points']})[0]
		if (!s) return

		console.log(s.properties)

		const popup = new mapboxgl.Popup()
		.setLngLat(s.geometry.coordinates)
		.setHTML(`
			<h2>
				${escape(s.properties.model)}
			</h2>
			<ul>
				<li><code>${escape(s.properties.license_plate)}</code></li>
				<li>${escape(s.properties.energy_level + '')}% Akku</li>
			</ul>
		`)
		popup.addTo(map)
	})
})
.catch(console.error) // todo
