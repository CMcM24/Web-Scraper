var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EntrySchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Entry = mongoose.model("Entry", EntrySchema);

module.exports = Entry;