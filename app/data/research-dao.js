function ResearchDAO(db) {
    "use strict";

    if (false === (this instanceof ResearchDAO)) {
        console.log("Warning: ResearchDAO constructor called without 'new' operator");
        return new ResearchDAO(db);
    }
}

module.exports = { ResearchDAO };
