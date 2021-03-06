const TAG = '[test-service]'
const { db } = require('../db-postgres')


function _log (msg, level = 'log') {
    console[level](`${TAG} ${msg}`)
}

  
async function run () {
    _log('Running test job222...')

    const currentDateJS = new Date();
    _log("CurrentDate NodeJS ==>"+currentDateJS);

    const currentDateDB = await db.one('select current_date')
    console.log(`Current Date DB = ${JSON.stringify(currentDateDB)}`)
    
    const nowDB = await db.one('select now()')
    console.log(`NOW DB = ${JSON.stringify(nowDB)}`)


    for(var i=0;i<10000;i++) {

    }

    _log('test job complete.')
}
  
module.exports = {
    run
}
