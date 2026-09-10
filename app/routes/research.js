const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts,
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        if (req.query.symbol) {
            const regex = /^[A-Za-z.]{1,10}$/;
            if (!regex.test(req.query.symbol)) throw "The supplied string must be a stock symbol.";
            // technically, for functionality's sake we'd need to get around Yahoo's bot limit situation because we're flagged as a bot
            // but that's out of the scope of this project!
            const targetUrl = "https://finance.yahoo.com/quote/";
            const url = targetUrl + req.query.symbol.toUpperCase();
            return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html",
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts,
        });
    };
}

module.exports = ResearchHandler;
