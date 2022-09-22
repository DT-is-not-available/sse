function SSE() {
	let cmds = this.cmds
	let vars = this.vars
	function run(string, index=0) {
		let lines = string.split(/\r?\n/gm)
		for (let i = index; i < lines.length; i++) {
			let origline = lines[i]
			lines[i] = lines[i].trimStart().trimEnd()
			let parts = lines[i].split("%")
			for (let i = 1; i < parts.length; i+=2) {
				parts[i] = vars[parts[i]]
			}
			lines[i] = parts.join("")
			let macroargs = lines[i].split(" ")
			let macroname = macroargs.shift()
			try {
				macroargs = JSON.parse(`[${macroargs.join(" ")}]`)
			} catch (e) {
				return `ERROR: Invalid arguments ${macroargs.join(" ")} at line ${i}\n${origline}`
			}
			if (!cmds[macroname] && !cmds["*"] && macroname.length > 0) {
				return "ERROR: Unknown command "+macroname+" at line "+i+"\n"+origline
			}
			if (cmds[macroname]) cmds[macroname](...macroargs)
			else if (cmds["*"]) cmds["*"](macroname, ...macroargs)
		}
	}
	return {
		run: run,
		cmds: cmds,
		vars: vars,
	}
}