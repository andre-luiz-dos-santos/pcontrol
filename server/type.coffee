{ spawn } = require 'child_process'


autohotkey = null


AutoHotkeyMap =
	Space: ' '
	Enter: '{Return}'
	Backspace: '{Backspace}'
	Tab: '{Tab}'
	Esc: '{Escape}'
	'!': '{Raw}!'
	'#': '{Raw}#'
	'^': '{^}'
	'{': '{{}'
	'}': '{}}'
	'+': '{+}'
	# "'": "{Blind}'"
	# ",": "{Blind},"
	# ".": "{Blind}."
	# ";": "{Blind};"
	# "/": "{Blind}/"
	# "\\": "{Blind}\\"

mapTextToAutoHotkey = (text) ->

	if text of AutoHotkeyMap
		return AutoHotkeyMap[text]

	return '{Blind}' + text


runAutoHotkey = ->

	autohotkey = spawn 'autohotkey.exe', ['type.ahk'],
		cwd: __dirname
		stdio: ['pipe', process.stdout, process.stderr]

	autohotkey.on 'exit', (code, signal) ->
		process.stderr.write("AutoHotkey type.ahk process terminated with exit code #{code} (signal=#{signal})\n")
		setTimeout(runAutoHotkey, 1000)
		autohotkey = null
		return

	return


sendToAutoHotkey = (text) ->
	if autohotkey? then autohotkey.stdin.write("#{text}\n")
	else process.stdout.write("AutoHotkey type.ahk process is not running yet.\n")
	return


exports.key = (text) ->
	sendToAutoHotkey(mapTextToAutoHotkey(text))


exports.text = (text) ->
	lines = text.split(/\r*\n/g)
	for line, index in lines
		sendToAutoHotkey("{Enter}") if index > 0
		sendToAutoHotkey("{Raw}#{line}")


runAutoHotkey()
