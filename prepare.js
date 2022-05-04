const fs = require('fs-extra')

// Async/Await:
async function copyFiles () {
	try {
	  await fs.copy('./dist/**.js', './dist/CS')
	  console.log('Files copied!')
	} catch (err) {
	  console.error(err)
	}
  }

  copyFiles()
