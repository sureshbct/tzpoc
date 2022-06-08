const testService = require('../../service/test-service')

async function run () {

  const startDate = new Date();

  console.log("DATE ===>"+startDate)
  console.log(startDate)

  await testService.run()
}

run().then(() => {
    process.exit(0)
  },
  (err) => {
    console.error(`[test-job] ${err.stack}`)
    process.exit(1)
  }
)
