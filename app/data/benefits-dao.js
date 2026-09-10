function BenefitsDAO(db) {
    "use strict";

    if (false === (this instanceof BenefitsDAO)) {
        console.log("Warning: BenefitsDAO constructor called without 'new' operator");
        return new BenefitsDAO(db);
    }

    const usersCol = db.collection("users");

    this.getAllNonAdminUsers = (callback) => {
        usersCol.find({
            isAdmin: {
                $ne: true,
            },
        }).toArray((err, users) => callback(null, users));
    };

    this.updateBenefits = (userId, startDate, callback) => {
        usersCol.update({
            _id: parseInt(userId),
        }, {
            $set: {
                benefitStartDate: startDate,
            },
        },
        (err, result) => {
            if (!err) {
                console.log("Updated benefits");
                return callback(null, result);
            }

            return callback(err, null);
        },
        );
    };
}

module.exports = { BenefitsDAO };
