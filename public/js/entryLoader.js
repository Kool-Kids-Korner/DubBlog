$(() => {
    // Get the template from the server for creating new entries
    axios.get("/entrytemplate").then((res) => {
        main(res.data);
    });
});

function main(template) {
    const entryListEL = $("#entries");
    const intialListELCount = 6;

    var page = 0;
    var loading = false
    var done = false;

    if(entryListEL.height() < $(window).height()) {
        load()
    };
    function load() {
        loading = true;
        page++;
        axios("/entries", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                page: page,
                limit: intialListELCount,
            },
        }).then((res) => {
            loading = false;
            if (res.data.length > 0) {
                res.data.forEach(element => {
                    entryListEL.append(fromTemplate(template, element))
                });
                if(entryListEL.height() < $(window).height()) {
                    load()
                };
            } else done = true;
        });
    }
    $(window).on("scroll resize", (event) => {
        var windowsHeight = $(document).height() - $(window).height();
        var currentScroll = $(window).scrollTop();

        // If I get neer to the end of the page
        if (windowsHeight - currentScroll < 60 && !loading && !done) {
            load();
        }
    });
}

function fromTemplate(template, entry) {
    return $(
        template
            .replace("{{title}}", entry.title)
            .replace("{{date}}", entry.date)
            .replace("{{version}}", entry.version)
            .replace("{{html}}", entry.html)
    );
}
