import * as React from 'react'
import { keyPressEvent$ } from '../store/keys'
import * as screenfull from 'screenfull'

// Returns true if fullscreen mode was requested.
function enterFullscreen(): boolean {
	if (!screenfull.enabled) {
		return false
	}
	if (screenfull.isFullscreen) {
		return false
	}
	screenfull.request()
	return true
}

function vibrate(pattern: number | number[]) {
	try {
		window.navigator.vibrate(pattern)
	} catch (error) {
	}
}

function animateElem(keyElem: HTMLDivElement) {
	let animationElem: HTMLDivElement = keyElem.cloneNode(true) as any
	let parentElem = document.getElementById('root')
	if (parentElem == null) {
		alert("Element with ID 'root' was not found!")
		return
	}
	const halfWidth = parentElem.clientWidth / 2
	if (keyElem.offsetLeft < halfWidth) {
		animationElem.className = "keyboard-key animation touch right start"
	} else {
		animationElem.className = "keyboard-key animation touch left start"
	}
	animationElem.style.left = keyElem.offsetLeft + 'px'
	animationElem.style.top = keyElem.offsetTop + 'px'
	animationElem.style.width = keyElem.offsetWidth + 'px'
	// animationElem.style.height = keyElem.offsetHeight + 'px'
	parentElem.appendChild(animationElem)
	setTimeout(() => { animationElem.remove() }, 1000)
}

interface KeyProps {
	text: string
}

export default class Key extends React.PureComponent<KeyProps, {}> {
	domKeyElem: HTMLDivElement | null

	_onPress = () => {
		if (this.domKeyElem == null) {
			return
		}
		if (!enterFullscreen()) {
			keyPressEvent$.next({ text: this.props.text })
			animateElem(this.domKeyElem)
			vibrate(50)
		}
	};

	render() {
		let styles: React.CSSProperties = {}
		if (this.props.text.length === 1) {
			styles.fontSize = '6vw'
		}
		return (
			<div
				className="keyboard-key"
				style={styles}
				onClick={this._onPress}
				ref={(elem) => { this.domKeyElem = elem }}
			>
				{this.props.text}
			</div>
		)
	}
}
