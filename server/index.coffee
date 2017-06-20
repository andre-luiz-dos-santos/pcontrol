express = require('express')
bodyParser = require('body-parser')
cors = require('cors')
http = require('http')
path = require('path')
type = require('./type')


webPort = parseInt(process.env.PORT || 3001)


app = express()
httpd = http.createServer(app)
app.use('/', express.static(path.join(__dirname, '../website/dist')))
app.use(cors())
app.use(bodyParser.json(type: '*/*'))


lastValueTimestamp = 0


app.post '/type', (req, res) ->
	values = (req.body?.values ? [])

	console.log("/type %s", JSON.stringify(values))

	for value in req.body.values
		if value.timestamp > lastValueTimestamp
			type.key(value.text)
			lastValueTimestamp = value.timestamp

	res.end(JSON.stringify(typed: values.length))
	return


app.post '/text', (req, res) ->
	text = (req.body?.text ? '')

	console.log("/text %s", JSON.stringify(text))
	type.text(text)

	res.end(JSON.stringify(typed: text.length))
	return


httpd.listen webPort, ->
	console.log("App listening on port #{webPort}!")
