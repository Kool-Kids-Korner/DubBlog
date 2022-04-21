const fs = require("fs");
const liTemplate = fs.readFileSync("./public/entryTemplate.html").toString();
/**
 *
 * @param {[{date: string, title: string, version: number, html: string}]} entries
 */
function generateHTMLList(entries, limit) {
    // Sort by date
    var htmlElments = [];
    entries.forEach((element, index) => {
        if (index >= limit) return htmlElments.join("");
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
 * @param {Number} limit
 * @returns {String}
 */
function render(template, entries, limit) {
    return template.replace("{{entries}}", generateHTMLList(entries, limit));
}

module.exports = render;
