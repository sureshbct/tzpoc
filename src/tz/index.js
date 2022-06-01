const tz = require('./tz')

const express = require('express')
const app = express()
// Setup the port
app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})
  
module.exports = app // for test
  

tz.run().then(
  r => {},
  e => console.log('[tz] run:', e)
)
