const fs = require("fs")
fs.copyFile("latest.js", `./r/1.0.${(new Date().getMonth()+1).toString().padStart(2, '0')}${new Date().getDate()}.0.js`, ()=>{})