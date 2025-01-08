const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', 
        required: true,
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', 
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Track', trackSchema);
