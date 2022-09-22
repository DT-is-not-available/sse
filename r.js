const fs = require("fs")
let latest = fs.readFileSync("latest.js")
let patch = 0
let ver
do {
	ver = `1.${(new Date().getMonth()+1).toString().padStart(2, '0')}${new Date().getDate()}.${patch}`
	patch++
} while (fs.existsSync(`./r/${ver}.js`))
fs.writeFileSync(
	`./r/${ver}.js`,
	`// ${ver}\n${latest}`
)