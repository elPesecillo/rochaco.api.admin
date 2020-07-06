const mongoose = require("mongoose");
const moment = require("moment");

const SuburbFileSchema = new mongoose.Schema({
    fileName: {
        type: String
    },
    originalName: {
        type: String
    },
    actionType: {
        type: String
    },
    mimetype: {
        type: String
    },
    transtime: {
        type: Date,
        default: moment.utc()
    }
});

module.exports = SuburbFileSchema;