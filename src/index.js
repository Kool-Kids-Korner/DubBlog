const express = require("express");
const fs = require("fs");
const path = require("path");
const render = require("./htmlRendering");

const PORT = process.env.PORT || 8080;
const app = express();

const releasesPath = "./releases";

// Cache the entrys
var entries = loadEntries();

function loadEntries() {
    return JSON.parse(fs.readFileSync("./entries.json")).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
}

fs.watchFile("./entries.json", () => {
    entries = loadEntries();
});

// Get all releases that are in the releases folder
app.get("/release", async (req, res) => {
    var basenames = [];
    var files = await fs.promises.readdir(releasesPath);
    files.forEach((element) => {
        basenames.push(path.parse(element).name);
    });
    res.send(basenames);
});
// Steams a file download of the files in releases folder
app.get("/release/:version", async (req, res) => {
    const version = req.params.version;
    const files = await fs.promises.readdir(releasesPath);
    var file = "";
    files.forEach((element) => {
        if (path.parse(element).name == version) {
            file = path.join(releasesPath, element);
        }
    });
    if (file != "") {
        // The built game files could get quite large so file steaming will help with preformance
        const stream = fs.createReadStream(file);
        res.setHeader(
            "Content-disposition",
            "attachment; filename=dubdub_v" + path.basename(file)
        );
        stream.pipe(res);
    } else {
        res.send(404);
    }
});

// Renders an html using the entries json.
// This is overbuilt but it can handel many entries on slow internet
app.get("/", async (req, res) => {
    const template = (
        await fs.promises.readFile("./templates/index.html")
    ).toString();
    res.send(render(template, entries));
});

// Static routes
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));

app.use("/jquery", express.static("./node_modules/jquery/dist/"));
app.use("/axios", express.static("./node_modules/axios/dist/"));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
