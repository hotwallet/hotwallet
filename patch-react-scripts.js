const fs = require('fs')
const filename = `${__dirname}/node_modules/react-scripts/config/webpack.config.prod.js`
let code = fs.readFileSync(filename, 'utf8')
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
fs.writeFileSync(filename, code)
