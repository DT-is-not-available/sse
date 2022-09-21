let cmds = {}
let vars = {}
function compile(string) {
	let lines = string.split(/\r?\n/gm)
	for (let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trimStart().trimEnd()
		let parts = lines[i].split("%")
		for (let i = 1; i < parts.length; i+=2) {
			parts[i] = vars[parts[i]]
		}
		lines[i] = parts.join("")
		let macroargs = lines[i].split(" ")
		let macroname = macroargs.shift()
		if (!cmds[macroname] && !cmds["*"]) {
			return "ERROR: Unknown macro "+macroname+" at line "+i+"\n"+lines[i]
		}
		if (cmds[macroname]) lines[i] = cmds[macroname](...macroargs)
		else lines[i] = cmds["*"](macroname, ...macroargs)
	}
	return lines.join("\n")
}
let SSE = {
	compile: compile,
	cmds: cmds,
	vars: vars,
}
export default SSE