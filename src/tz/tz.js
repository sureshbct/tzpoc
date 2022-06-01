const scheduling = require('../lib/scheduling')

async function run () {
    console.log('[tz] Dyno startup...')

    scheduling.scheduleTestJob('tz')
    console.log('[tz] Dyno startup complete.')
    console.log(`[tz] Current dyno timestamp = ${new Date()}`)
}  

module.exports = {
    run
  }