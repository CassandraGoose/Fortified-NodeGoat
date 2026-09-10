const MemosDAO = require("../data/memos-dao").MemosDAO;
const marked = require("marked");

const sanitizeHtml = require("sanitize-html");

const {
    environmentalScripts,
} = require("../../config/config");

function MemosHandler(db) {
    "use strict";

    const memosDAO = new MemosDAO(db);

    this.addMemos = (req, res, next) => {
        memosDAO.insert(req.body.memo, (err) => {
            if (err) return next(err);
            this.displayMemos(req, res, next);
        });
    };

    this.displayMemos = (req, res, next) => {
        const {
            userId,
        } = req.session;

        memosDAO.getAllMemos((err, docs) => {
            if (err) return next(err);

            const memosList = docs.map(doc => ({
                ...doc,
                safeMemo: sanitizeHtml(marked(doc.memo), {
                    allowedTags: ["p", "a", "ul", "ol", "li", "strong", "em", "b", "i", "h1", "h2", "pre", "code", "br"],
                    allowedAttributes: { a: ["href"] },
                    allowedSchemes: ["http", "https"],
                }),
            }));
            return res.render("memos", {
                memosList,
                userId: userId,
                environmentalScripts,
            });
        });
    };
}

module.exports = MemosHandler;
