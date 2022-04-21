const fs = require("fs");
const liTemplate = fs.readFileSync("./public/entryTemplate.html").toString();
/**
 *
 * @param {[{date: string, title: string, version: number, html: string}]} entries
 */
function generateHTMLList(entries) {
    // Sort by date
    var htmlElments = [];
    entries.forEach((element, index) => {
        htmlElments.push(
            listEl(element.title, element.date, element.version, element.html)
        );
    });
    return htmlElments.join("");
}
function listEl(title, date, version, html) {
    return liTemplate
        .replace("{{title}}", title)
        .replace("{{date}}", date)
        .replace("{{version}}", version)
        .replace("{{html}}", html);
}
/**
 *
 * @param {String} template
 * @param {[{date: string, title: string, version: number, html: string}]} entries
 * @returns {String}
 */
function render(template, entries) {
    return template.replace("{{entries}}", generateHTMLList(entries));
}

module.exports = render;
