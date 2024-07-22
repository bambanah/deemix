const { execSync } = require('child_process')
const fs = require('fs')

const pack = JSON.parse(fs.readFileSync('package.json'))
pack.version = '0.0.0'
fs.writeFileSync('package.json', JSON.stringify(pack, null, 2) + '\n')
