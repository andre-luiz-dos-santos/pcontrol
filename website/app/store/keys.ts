import { changeScreen } from './screen'
import { Subject } from 'rxjs'
import { ajaxPost } from '../rxjs/ajax'
import '../rxjs/bufferSeq'

interface KeyPressEvent {
	text: string
}

// A Key component was clicked.
export const keyPressEvent$ = new Subject<KeyPressEvent>()

interface KeyValue {
	text: string
	timestamp: number // milliseconds
}

function addTimestamp(text: string): KeyValue {
	const timestamp = new Date().getTime()
	return { timestamp, text }
}

function sendValues(values: KeyValue[]) {
	return ajaxPost({
		url: 'type',
		body: JSON.stringify({ values }),
	}).retry(5)
}

keyPressEvent$
	.map(event => event.text)
	// TODO
	// 'changeScreen' is not defined when this code runs
	// .filter(changeScreen)
	.filter(text => changeScreen(text))
	.map(addTimestamp)
	.bufferSeq(sendValues)
	.subscribe(() => { })
