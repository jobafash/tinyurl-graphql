'use strict';
const mongoose = require('mongoose');
const Hashids = require('hashids/cjs');
const crypto = require('crypto');
const Index = require('./indexModel');

const hashids = new Hashids('secret ;)', 6);

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  _id: Number,
  hash: { type: String, index: true, unique: true },
  url: { type: String, required: true },
  short_url: { type: String, unique: true },
  isObscured: Boolean,
  expiresAt: Date,
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Before actually saving the document, get a numeric ID and calculate the hash
 * NOTE: We don't actually get the document in the pre save hook, so I'm using the post validate hook instead
 */
urlSchema.post('validate', (doc, next) => {
  Index.findByIdAndUpdate(
    { _id: 'urlIndex' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
    (error, index) => {
      if (error) return next(error);

      doc._id = index.seq;
      doc.hash = hashids.encode(doc._id);

      if (doc.isObscured) {
        doc.hash = crypto
          .createHash('sha256')
          .update(doc.hash, 'utf-8')
          .digest('hex');
      }

      next();
    }
  );
});

module.exports = mongoose.model('URL', urlSchema);
