// 1.0922.1
function SSE() {
	let cmds = SSE.cmds
	let keywords = SSE.keywords
	let vars = {}
	let i
	let _this = {
		run: run,
		vars: vars,
		stop: stop,
	}
	function run(string, index=0) {
		let lines = string.split(/\r?\n/gm)
		for (i = index; i < lines.length && i >= 0; i++) {
			let origline = lines[i]
			let line = lines[i].trimStart().trimEnd()
			let parts = line.split("%")
			for (let i = 1; i < parts.length; i+=2) {
				parts[i] = vars[parts[i]]
			}
			line = parts.join("")
			let args = line.split(" ")
			let keywordargs = line.match(/".*?"|\S+/gm)
			let cmdname = args.shift()
			keywordargs.shift()
			let ni
			if (SSE["*"]) ni = SSE["*"].apply(_this, [line, i, string])
			if (cmds[cmdname]) {
				let cmdargs
				try {
					cmdargs = JSON.parse(`[${args.join(" ")}]`)
				} catch (e) {
					SSE.onerr(`Invalid arguments ${args.join(" ")} at line ${i}\n${origline}\n${e.stack}`)
				}
				ni = cmds[cmdname].apply(_this, [cmdargs, i, string])
			} else if (keywords[cmdname]) {
				ni = keywords[cmdname].apply(_this, [keywordargs, i, string])
			} else if (cmdname.length > 0)
				SSE.onerr("Unknown command "+cmdname+" at line "+i+"\n"+origline)
			if (typeof ni == "number") i = ni-1
		}
	}
	return _this
}
SSE.cmds = {}
SSE.keywords = {}
SSE.onerr = (msg)=>{alert(msg)}