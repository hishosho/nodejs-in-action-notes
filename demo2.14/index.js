const async = require('async')
const exec = require('child_process').exec

function downloadNodeVersion (version, destination, callback) {
  const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`
  const filepath = `${destination}/${version}.tgz`
  // 下载文件
  exec(`curl ${url} > ${filepath}`, callback)
}

async.series([
  callback => {
    async.parallel([
      callback => {
        console.log('Downloading Node v4.4.7...')
        downloadNodeVersion('4.4.7', './demo2.14/tmp', callback)
      },
      callback => {
        console.log('Downloading Node v6.3.0...')
        downloadNodeVersion('6.3.0', './demo2.14/tmp', callback)
      }
    ], callback)
  },
  callback => {
    console.log('Creating archive of downloaded files...')
    exec('tar cvf ./demo2.14/tmp/node_distros.tar ./demo2.14/tmp/4.4.7.tgz ./demo2.14/tmp/6.3.0.tgz', err => {
      if (err) throw err
      console.log('All done')
      callback()
    })
  }
])