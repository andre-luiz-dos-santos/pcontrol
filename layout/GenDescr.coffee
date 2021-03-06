fs = require('fs')
path = require('path')

genBy = """
/*
** Generated by GenDescr.coffee
*/

"""

fileHeader = (keyboardName) -> """
	import * as React from 'react'
	import Key from './Key'

	export default class #{keyboardName} extends React.PureComponent<{}, {}> {
		render() {
			return (
				<div className="keyboard-row-container">

	"""

rowHeader = """
				<div className="keyboard-cell-container">

"""
keyComponent = (key) ->
	key = key.replace('"', '&quot;')
	key = key.replace('\\', '&#92;')
	"<Key text=\"#{key}\" />\n"

rowFooter = """
				</div>

"""
fileFooter = """
			</div>
		);
	}
}

"""

websiteComponentsDir = "#{__dirname}/../website/app/components"

genKeyboardFile = (keyboardName, inputFile) ->
	data = fs.readFileSync(inputFile, {encoding: 'utf8'})
	lines = data.split(/\r*\n/)
	splitRow = (line) ->
		line.split(/ +/)
	yield genBy
	yield fileHeader(keyboardName)
	for line in lines
		line = line.trim()
		continue if line is ''
		yield rowHeader
		for key in splitRow(line)
			yield keyComponent(key)
		yield rowFooter
	yield fileFooter
	return

writeKeyboardFiles = ->
	for inputFile in fs.readdirSync('.') when /\.descr/.test(inputFile)
		keyboardName = path.basename(inputFile, '.descr')
		outputFile = "#{keyboardName}.tsx"
		console.log("Converting #{inputFile} to #{outputFile}")
		text = (block for block from genKeyboardFile(keyboardName, inputFile)).join("")
		fs.writeFileSync("#{websiteComponentsDir}/#{outputFile}", text)
		{ keyboardName, outputFile }

genIndexFile = ->
	keyboards = writeKeyboardFiles()
	yield genBy
	for { keyboardName, outputFile } in keyboards
		yield "import #{keyboardName} from './#{outputFile.replace('.tsx', '')}'"
	yield "import * as React from 'react'"
	yield "export default {"
	for { keyboardName, outputFile } in keyboards
		key = keyboardName.replace(/(case)?Keyboard$/, '')
		yield "#{key}: #{keyboardName},"
	yield "} as { [name: string]: typeof React.Component }"

text = (block for block from genIndexFile()).join("\n")
fs.writeFileSync("#{websiteComponentsDir}/KeyboardIndex.ts", text)
