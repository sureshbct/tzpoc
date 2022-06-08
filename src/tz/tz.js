const scheduling = require('../lib/scheduling')
const { db } = require('../lib/db-postgres')

async function run () {
    console.log('[tz] Dyno startup...')

    scheduling.scheduleTestJob('tz')
    console.log('[tz] Dyno startup complete.')
    console.log(`[tz] Current dyno timestamp = ${new Date()}`)

    const dbTimezone = await db.one('SHOW TIMEZONE')
    console.log('[tz] Dyno startup complete.')
    console.log(`[tz] Current dyno timestamp = ${new Date()}`)
    console.log(`[tz] Current db timezone = ${JSON.stringify(dbTimezone)}`)

    const currentDate = await db.one('select current_date')
    console.log(currentDate)
    console.log(`[tz] Current Date = ${JSON.stringify(currentDate)}`)


}  

module.exports = {
    run
  }