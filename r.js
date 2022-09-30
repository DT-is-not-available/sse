// nodejs script to create a new release file
const fs = require("fs")
let latest = fs.readFileSync("latest.js").toString()
let patch = 0
let ver
do {
	ver = `1.${(new Date().getMonth()+1).toString().padStart(2, '0')}${(new Date().getDate())}.${patch}`
	patch++
} while (fs.existsSync(`./r/${ver}.js`))
fs.writeFileSync(
	`./r/${ver}.js`,
	`// ${ver}\n${latest}`
)
fs.writeFileSync(
	"archive.md",
	`${ver}\n\`\`\`html\n<script src="https://sse.js.org/r/${ver}.js"></script>\n\`\`\`\n`+fs.readFileSync("archive.md").toString()
)