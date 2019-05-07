const fs = require('fs')

// get the webpack config file
const filename = `${__dirname}/node_modules/react-scripts/config/webpack.config.js`
let code = fs.readFileSync(filename, 'utf8')

// don't mangle some bitcooinjs class names
const searchValue = `mangle: {
            safari10: true,`
const replaceValue = `mangle: {
            reserved: [
              'Buffer',
              'BigInteger',
              'Point',
              'ECPubKey',
              'ECKey',
              'sha512_asm',
              'asm',
              'ECPair',
              'HDNode'
            ],
            safari10: true,`
code = code.replace(searchValue, replaceValue)

// replace the webpack config file with our changes
fs.writeFileSync(filename, code)
