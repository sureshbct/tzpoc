const TAG = '[test-service]'


function _log (msg, level = 'log') {
    console[level](`${TAG} ${msg}`)
}

  
async function run () {
    _log('Running test job...')

    for(var i=0;i<10000;i++) {

    }

    _log('test job complete.')
}
  
module.exports = {
    run
}
