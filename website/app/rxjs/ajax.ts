import { ajax } from 'rxjs/observable/dom/ajax'

interface AjaxRequest {
	url: string
	body: string
}

export function ajaxPost(request: AjaxRequest) {
	const defaults = {
		method: 'POST',
		responseType: 'json',
		headers: {
			'Content-Type': 'application/json',
		},
	}
	return ajax({ ...defaults, ...request })
}
