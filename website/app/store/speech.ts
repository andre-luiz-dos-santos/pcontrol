import { Subject, BehaviorSubject } from 'rxjs'
import { ajaxPost } from '../rxjs/ajax'

// Speech component's <textarea> value.
export const textInput$ = new BehaviorSubject<string>('')
// Speech component's Type button was clicked.
export const textTypeEvent$ = new Subject<string>()

function sendText(text: string) {
	return ajaxPost({
		url: 'text',
		body: JSON.stringify({ text }),
	})
}

textTypeEvent$
	.switchMap(text => {
		return sendText(text)
			.catch((err: any) => {
				alert(`Error sending text: ${err}`)
				return []
			})
	})
	.subscribe(() => {
		textInput$.next('')
	})
