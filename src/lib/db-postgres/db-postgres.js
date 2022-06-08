const enableQueryLogger = process.env.DATABASE_ENABLE_QUERY_LOGS === 'true' || false

let receive
if (enableQueryLogger) {
  receive = function (data, result, e) {
    if (result.command === 'SELECT' || result.command === 'INSERT' || result.command === 'DELETE' || result.command === 'UPDATE') {
      const queryStr = JSON.stringify(e.query)
      console.log(`DBQUERYLOG: duration: ${result.duration} - rows: ${result.rowCount} - query: ${queryStr}`)
    } else {
      console.log(`DBQUERYLOG: duration: ${result.duration} - ${result.command}`)
    }
  }
}

const pgp = require('pg-promise')({
  receive,
  error: (err, e) => {
    err.eventContext = e
  }
})

if (!JSON.parse(process.env.DATABASE_SSL_DISABLED || 'false')) {
  pgp.pg.defaults.ssl = {
    rejectUnauthorized: false
  }
}
pgp.pg.defaults.application_name = process.env.DATABASE_APPLICATION_NAME || ''

// if you receive "Error: self signed certificate" you can pass the config like this:
// See more at: https://github.com/vitaly-t/pg-promise/wiki/Connection-Syntax
// const config = {
//   connectionString: process.env.DATABASE_URL,
//   max: 30,
//   ssl: pgp.pg.defaults.ssl
// }
// const db = pgp(config)

const db = pgp(process.env.DATABASE_URL, {})
const pgpHelpers = pgp.helpers
pgp.pg.types.setTypeParser(20, parseInt);
module.exports = {
  db, pgpHelpers
}
