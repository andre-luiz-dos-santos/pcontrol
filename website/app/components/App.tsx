import * as React from 'react'
import { Subscription } from 'rxjs/Rx'
import Keyboard from './Keyboard'
import Speech from './Speech'
import { screenChangeEvent$ } from '../store/screen'

interface AppState {
	speech: boolean
}

export class App extends React.PureComponent<{}, AppState> {
	screenChangeSubscription: Subscription

	constructor(props: any) {
		super(props)
		this.state = {
			speech: false
		}
	}

	componentDidMount() {
		this.screenChangeSubscription = screenChangeEvent$.subscribe(layoutName => {
			this.setState({
				speech: (layoutName === "Speech")
			})
		})
	}

	componentWillUnmount() {
		this.screenChangeSubscription.unsubscribe()
	}

	render() {
		return (
			this.state.speech ? <Speech /> : <Keyboard />
		)
	}
}
