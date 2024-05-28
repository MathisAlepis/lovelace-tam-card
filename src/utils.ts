import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { AllDataTypes } from './types';
import ALLDATA from './merged_data.json';

const all_data: AllDataTypes[] = ALLDATA as AllDataTypes[];

export function getTripHeadsign(stopName): any {
	const tripHeadsigns: any = [];
	all_data.forEach(item => {
		if (item.stop_name === stopName) {
			tripHeadsigns.push(item.trip_headsign);
		}
	});
	const uniqueTripHeadsigns = tripHeadsigns.filter((value, index, self) => self.indexOf(value) === index);
	uniqueTripHeadsigns.sort();

	return uniqueTripHeadsigns.length ? uniqueTripHeadsigns : ['Stop non trouvé'];
}

export function getAllStops(): string[] {
	let allStop = all_data.map(objet => objet.stop_name);
	allStop = [...new Set(allStop)];
	allStop.sort();
	return allStop;
}

export function timestampToTime(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	const hours = date.getHours();
	const minutes = `0${date.getMinutes()}`.slice(-2);
	const seconds = `0${date.getSeconds()}`.slice(-2);
	return `${hours}:${minutes}:${seconds}`;
}

export function showTrip(tripData: any): any {
	const data = all_data.find(item => item.trip_id.includes(tripData.tripId));
	if (data) {
		if (data.hasOwnProperty('trip_headsign') && data.trip_headsign !== '') {
			return data.trip_headsign;
		}
	}
	return 'Destination inconnue';
}

function searchStopAndDirection(stopName, direction): any {
	const results: any = [];
	all_data.forEach(item => {
		if (item.stop_name === stopName && item.trip_headsign === direction) {
			results.push({
				stop_id: item.stop_id,
				route_id: item.route_id,
				trip_headsign: item.trip_headsign,
				stop_name: item.stop_name,
			});
		}
	});

	return results;
}

function numberOrLongToNumber(data: any): number {
	if (data.hasOwnProperty('low')) {
		return data.low;
	}
	return data;
}

export async function findData(direction): Promise<any> {
	if (direction === undefined || direction.length === 0 || direction === null) return null;
	const response = await fetch(
		'https://cors-proxy-tam.herokuapp.com/https://data.montpellier3m.fr/TAM_MMM_GTFSRT/TripUpdate.pb',
		{
			mode: 'cors',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		},
	);
	if (!response.ok) {
		const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
		error['response'] = response;
		throw error;
	}
	const buffer = await response.arrayBuffer();
	const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
	const data: any = [];
	feed.entity.forEach(entity => {
		if (entity.tripUpdate) {
			if (entity.tripUpdate.trip.routeId === direction.route_id) {
				if (entity.tripUpdate.stopTimeUpdate) {
					entity.tripUpdate.stopTimeUpdate.forEach(stop => {
						if (direction.stop_id === stop.stopId) {
							if (stop.arrival && stop.arrival.time) {
								const timestamp = numberOrLongToNumber(stop.arrival.time);
								if (timestamp > Date.now() / 1000) {
									data.push({
										trip: direction.trip_headsign,
										departure_time: timestampToTime(timestamp),
									});
								}
							}
						}
					});
				}
			}
		}
	});
	const parsedObject: any = [];

	for (const item of data) {
		parsedObject.push({
			trip_headsign: item.trip,
			departure_time: item.departure_time,
			route_short_name: direction.route_id.split('-')[1],
			stop_name: direction.stop_name,
		});
	}

	parsedObject.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
	return parsedObject;
}

function toPascalCase(str): any {
	return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export async function getData(stopName, direction): Promise<any> {
	let obj = await searchStopAndDirection(stopName, direction);
	if (obj.length === 0) {
		const new_stopName = toPascalCase(stopName);
		obj = await searchStopAndDirection(new_stopName, direction);
	}
	return await findData(obj[0]);
}
