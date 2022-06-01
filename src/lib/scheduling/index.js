const CronJob = require('cron').CronJob
const _ = require('lodash')
const moment = require('moment')
const { fork } = require('child_process')

const config = require('./config')

const runningProcesses = {}

const runningSchedulers = []

function formatDate (date) {
  return moment.tz(date, config.TIME_ZONE).format('YYYY-MM-DD HH:mm:ss Z z')
}

function getNextRun (cronSchedule) {
  const date = cronSchedule.nextDates()
  return `${formatDate(date)} - ${moment(date).fromNow()}`
}
function _createForkProcess (dyno, name, jobPath, threadNumber) {
  let forkedProcess = runningProcesses[name]
  if (forkedProcess) {
    console.log(`[${dyno}][scheduling][${name}] already running - ignoring.`)
    return forkedProcess
  }
  forkedProcess = fork(jobPath, [threadNumber], { execArgv: ['--harmony'] })
  forkedProcess._startDate = new Date()
  runningProcesses[name] = forkedProcess

  forkedProcess.on('close', (code) => {
    delete runningProcesses[name]
    if (code !== 0) {
      console.error(`[${dyno}][scheduling][${name}] finished with code ${code}`)
    }
  })
  return forkedProcess
}
function runForked (dyno, jobConfig) {
  let jobPath = jobConfig.path
  const name = jobConfig.name
  if (jobPath.startsWith('./')) {
    jobPath = `${__dirname}/${jobPath}`
  }
  if (_.isNil(jobConfig.parallel)) {
    return _createForkProcess(dyno, name, jobPath)
  } else {
    return _.range(jobConfig.parallel)
      .map(i => {
        return _createForkProcess(dyno, name + '_' + i, jobPath, i)
      })
  }
}

function scheduleCronJob (dyno, jobConfig) {
  if (!jobConfig) {
    throw new Error('Job configuration not provided.')
  }

  if (jobConfig.disabled) {
    console.log(`[${dyno}][scheduling][${jobConfig.name}] Job disabled.`)
    return
  }

  const schedule = jobConfig.schedule
  if (!schedule) {
    console.warn(`[${dyno}][scheduling]: ${jobConfig.name} schedule is not set.`)
    return
  }

  let cronSchedule
  let startDate
  let forkedProcess
  try {
    cronSchedule = new CronJob({
      cronTime: schedule,
      onTick: async () => {
        startDate = new Date()
        console.log(`[${dyno}][scheduling][${jobConfig.name}] Running scheduled job...`)
        forkedProcess = runForked(dyno, jobConfig)
      },
      start: true,
      timeZone: config.TIME_ZONE,
      runOnInit: jobConfig.onStartup
    })
    runningSchedulers.push({name: jobConfig.name, scheduler: cronSchedule})

    console.log(`[${dyno}][scheduling][${jobConfig.name}] Scheduled run: ${getNextRun(cronSchedule)} (${schedule})`)
  } catch (e) {
    console.error(`[${dyno}][scheduling][${jobConfig.name}]: ${e.stack}`)
  }

  return forkedProcess
}

function scheduleTestJob (dyno) {
  return scheduleCronJob(dyno, config.JOBS.TEST_JOB)
}

module.exports = {
  scheduleCronJob,
  scheduleTestJob
}
