import { Subject } from 'rxjs'
import keyboardsByName from '../components/KeyboardIndex'

export const screenChangeEvent$ = new Subject<string>()

const screenNames =
	Object.keys(keyboardsByName)
		.concat(['Speech'])

// Used as filter for keyPressEvent$'s values.
export function changeScreen(text: string): boolean {
	if (screenNames.includes(text)) {
		screenChangeEvent$.next(text)
		return false
	}
	return true
}
