import * as React from 'react'
import { screenChangeEvent$ } from '../store/screen'
import { textInput$, textTypeEvent$ } from "../store/speech";
import { Subscription } from "rxjs/Rx";
import * as screenfull from 'screenfull'

interface SpeechState {
	text: string
}

const containerStyle: React.CSSProperties = {
	display: 'flex',
}

const textAreaStyle: React.CSSProperties = {
	height: '100%',
	flex: 1,
}

const buttonColumnStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
}

const buttonStyle: React.CSSProperties = {
	flex: '1',
	color: '#ffffff',
	backgroundColor: '#000000',
}

export default class Speech extends React.PureComponent<{}, SpeechState> {
	textInputSubscription: Subscription
	domTextElem: HTMLTextAreaElement

	constructor(props: any) {
		super(props)
		this.state = {
			text: ''
		}
	}

	componentDidMount() {
		this.textInputSubscription = textInput$.subscribe(text => {
			this.setState({ text })
		})
		screenfull.exit()
	}

	componentWillUnmount() {
		this.textInputSubscription.unsubscribe()
	}

	_onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		textInput$.next(event.target.value)
	}

	_onSendButtonClick = () => {
		textTypeEvent$.next(this.state.text)
		this.domTextElem.focus()
	}

	_onBackButtonClick = () => {
		screenChangeEvent$.next('Lower')
		screenfull.request()
	}

	render() {
		return (
			<div id="speech" style={containerStyle}>
				<textarea
					style={textAreaStyle}
					value={this.state.text}
					onChange={this._onTextChange}
					ref={(elem) => { this.domTextElem = elem }}
				/>
				<div style={buttonColumnStyle}>
					<button onClick={this._onSendButtonClick} style={buttonStyle}>Type</button>
					<button onClick={this._onBackButtonClick} style={buttonStyle}>Back</button>
				</div>
			</div>
		)
	}
}
