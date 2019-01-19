process.on('uncaughtException', function(e) {
  console.error(e)
})

process.on('unhandledRejection', function(e) {
  console.error(e)
})
