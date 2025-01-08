const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    category: {
      type: String,
      enum: ['artist', 'album', 'track'], 
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Favorite', favoriteSchema);
