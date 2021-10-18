const fs = require('fs')
const events = require('events')

class Watcher extends events.EventEmitter {
  constructor (watcherDir, processedDir) {
    super()
    this.watcherDir = watcherDir
    this.processedDir = processedDir
  }
  watch () {
    fs.readdir(this.watcherDir, (err, files) => {
      if (err) throw err
      for (const index in files) {
        this.emit('process', files[index])
      }
    })
  }
  start () {
    fs.watchFile(this.watcherDir, () => {
      this.watch()
    })
  }
}

module.exports = Watcher

const watcher = new Watcher('./demo2.8/watchDir', './demo2.8/processedDir')
watcher.on('process', (file) => {
  const watchFile = `./demo2.8/watchDir/${file}`
  const processedFile = `./demo2.8/processedDir/${file.toLowerCase()}`
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err
  })
})

watcher.start();

