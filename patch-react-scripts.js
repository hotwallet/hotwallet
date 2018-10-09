const fs = require('fs')
const filename = `${__dirname}/node_modules/react-scripts/config/webpack.config.prod.js`
const code = fs.readFileSync(filename, 'utf8')
const patchedCode = code.replace('safari10: true,', 'safari10: false,')
fs.writeFileSync(filename, patchedCode)
