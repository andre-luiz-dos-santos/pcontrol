import * as React from 'react'
import { Subscription } from 'rxjs'
import { screenChangeEvent$ } from '../store/screen'
import keyboardsByName from './KeyboardIndex'

interface KeyboardState {
	keyboard: typeof React.Component
}

export default class Keyboard extends React.PureComponent<{}, KeyboardState> {
	screenChangeSubscription: Subscription

	constructor(props: any) {
		super(props)
		this.state = {
			keyboard: keyboardsByName.Lower,
		}
	}

	componentDidMount() {
		this.screenChangeSubscription = screenChangeEvent$.subscribe(layoutName => {
			this.setState({
				keyboard: keyboardsByName[layoutName],
			})
		})
	}

	componentWillUnmount() {
		this.screenChangeSubscription.unsubscribe()
	}

	render() {
		return (
			<this.state.keyboard />
		)
	}
}
