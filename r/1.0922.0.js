// 1.0922.0
function SSE() {
	let cmds = SSE.cmds
	let keywords = SSE.keywords
	let vars = {}
	function run(string, index=0) {
		let lines = string.split(/\r?\n/gm)
		for (let i = index; i < lines.length; i++) {
			let origline = lines[i]
			let line = lines[i].trimStart().trimEnd()
			let parts = line.split("%")
			for (let i = 1; i < parts.length; i+=2) {
				parts[i] = vars[parts[i]]
			}
			line = parts.join("")
			let keywordargs = line.split(" ")
			let cmdname = keywordargs.shift()
			if (SSE["*"]) SSE["*"](line)
			if (cmds[cmdname]) {
				let cmdargs
				try {
					cmdargs = JSON.parse(`[${keywordargs.join(" ")}]`)
				} catch (e) {
					return {error: `Invalid arguments ${cmdargs.join(" ")} at line ${i}\n${origline}`}
				}
				cmds[cmdname](...cmdargs)
			} else if (keywords[cmdname]) {
				keywords[cmdname](...keywordargs)
			} else if (cmdname.length > 0)
				return {error: "Unknown command "+cmdname+" at line "+i+"\n"+origline}
		}
		return {error: false}
	}
	return {
		run: run,
		vars: vars,
	}
}
SSE.cmds = {}
SSE.keywords = {}