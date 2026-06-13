const fs = require('fs');
let txt = fs.readFileSync('routes/apiRoutes.js');
// The file has some utf-8 and some utf-16le at the end due to powershell
let str = txt.toString('utf8');
// remove anything after module.exports = router;
let idx = str.indexOf('module.exports = router;');
if (idx !== -1) {
  let cleanStr = str.substring(0, idx + 'module.exports = router;'.length) + '\n';
  fs.writeFileSync('routes/apiRoutes.js', cleanStr);
}
