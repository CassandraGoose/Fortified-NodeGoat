const crypto = require("crypto");
const { cryptoAlgo, cryptoKey } = require("../../config/config");

function ProfileDAO(db) {
    "use strict";

    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO(db);
    }

    const users = db.collection("users");

    const encrypt = (plainText) => {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(cryptoAlgo, cryptoKey, iv);
        const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
        const tag = cipher.getAuthTag();
        return `${iv.toString("hex")}:${encrypted.toString("hex")}:${tag.toString("hex")}`;
    };

    const decrypt = (ciphertext) => {
        const [ivHex, encryptedHex, tagHex] = ciphertext.split(":");
        const decipher = crypto.createDecipheriv(cryptoAlgo, cryptoKey, Buffer.from(ivHex, "hex"));
        decipher.setAuthTag(Buffer.from(tagHex, "hex"));
        return decipher.update(encryptedHex, "hex", "utf8") + decipher.final("utf8");
    };

    this.updateUser = (userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting, callback) => {
        const user = {};
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (address) {
            user.address = encrypt(address);
        }
        if (bankAcc) {
            user.bankAcc = encrypt(bankAcc);
        }
        if (bankRouting) {
            user.bankRouting = encrypt(bankRouting);
        }
        if (ssn) {
            user.ssn = encrypt(ssn);
        }
        if (dob) {
            user.dob = encrypt(dob);
        }

        users.update({
            _id: parseInt(userId),
        }, {
            $set: user,
        },
        (err) => {
            if (!err) {
                console.log("Updated user profile");
                return callback(null, user);
            }

            return callback(err, null);
        },
        );
    };

    this.getByUserId = (userId, callback) => {
        users.findOne({
            _id: parseInt(userId),
        },
        (err, user) => {
            if (err) return callback(err, null);
            try {
                user.address = user.address ? decrypt(user.address) : "";
                user.bankAcc = user.bankAcc ? decrypt(user.bankAcc) : "";
                user.bankRouting = user.bankRouting ? decrypt(user.bankRouting) : "";
                user.dob = user.dob ? decrypt(user.dob) : "";
                user.ssn = user.ssn ? decrypt(user.ssn) : "";

            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                return callback(new Error("Information decryption failed"));
            }

            callback(null, user);
        },
        );
    };
}

module.exports = { ProfileDAO };
