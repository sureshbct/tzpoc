const TEST_JOB_CRON = process.env.TEST_JOB_CRON || '*/1 * * * *' // every 1 minute
const TIME_ZONE = process.env.SCHEDULING_TIME_ZONE || 'EST'
const DISABLE_TEST_JOB = JSON.parse(process.env.DISABLE_TEST_JOB || 'false')  

module.exports = {
    TIME_ZONE: TIME_ZONE,
    JOBS: {
      TEST_JOB: {
        name: 'test-job',
        schedule: TEST_JOB_CRON,
        path: './jobs/test-job.js',
        onStartup: true,
        disabled: DISABLE_TEST_JOB
      }
    }
}  