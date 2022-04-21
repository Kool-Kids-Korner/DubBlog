const fs = require("fs");
const mustache = require("mustache");
const path = require("path");

const liTemplate = fs.readFileSync("./templates/entryTemplate.html").toString()
const entryFilesDir = "./templates/entries/"
/**
 *
 * @param {String} template
 * @param {[{date: string, title: string, version: number, file: string}]} entries
 */
function render(template, entries) {
    return mustache.render(template, { 
        entries: entries.map(el => {
            el.content = fs.readFileSync(path.join(entryFilesDir, el.file)).toString()
            return mustache.render(liTemplate, el)
        }) 
    });
}
module.exports = render;
