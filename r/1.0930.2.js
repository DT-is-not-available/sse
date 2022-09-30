// 1.0930.2
function SSE() {
	let cmds = SSE.cmds
	let keywords = SSE.keywords
	let vars = {}
	let i
	let savedI = 0
	let script = ""
	let _this = {
		run: run,
		resume: resume,
		vars: vars,
		pause: pause,
		stop: stop,
		running: false,
	}
	function stop() {
		savedI = 0
		_this.running = false
		return -1
	}
	function pause() {
		savedI = i
		return -1
	}
	function run(string, index = 0) {
		_this.running = true
		script = string
		resume(index)
	}
	function resume(index = savedI) {
		if (!_this.running) return
		let lines = script.split(/\r?\n/gm)
		for (i = index; i < lines.length && i >= 0; i++) {
			if (i < 0) return
			let origline = lines[i]
			let line = lines[i].trimStart().trimEnd()
			let parts = line.split("%")
			for (let i = 1; i < parts.length; i += 2) {
				parts[i] = vars[parts[i]]
			}
			line = parts.join("")
			let args = line.split(" ")
			if (args.length == 0) continue
			let keywordargs = line.match(/".*?"|\S+/gm)
			let cmdname = args.shift()
			if (keywordargs) keywordargs.shift()
			let ni
			if (SSE["*"]) ni = SSE["*"].apply(_this, [line, i, script])
			if (ni != "ignore") {
				if (cmds[cmdname]) {
					let cmdargs
					try {
						cmdargs = JSON.parse(`[${args.join(" ")}]`)
					} catch (e) {
						SSE.error(`Invalid arguments ${args.join(" ")} at line ${i}\n${origline}\n${e.stack}`)
						break
					}
					ni = cmds[cmdname].apply(_this, [cmdargs, i, script])
				} else if (keywords[cmdname]) {
					ni = keywords[cmdname].apply(_this, [keywordargs, i, script])
				} else if (cmdname.length > 0) {
					SSE.error("Unknown command " + cmdname + " at line " + i + "\n" + origline)
					break
				}
				if (typeof ni == "number") i = ni - 1
			}
		}
		if (i >= lines.length) _this.running = false
	}
	return _this
}
SSE.cmds = {}
SSE.keywords = {}
SSE.error = (msg) => { alert(msg) }