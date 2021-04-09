'use strict';
const URL = require('../models/urlModel');
const Index = require('../models/indexModel');
const checkUrl = require('../utils/helpers').checkUrl;
const makeid = require('../utils/helpers').makeid;

const minify = async (
  req,
  { url, isObscured, expiresAt },
  io
) => {
  if (checkUrl(url) == true){
    let hash = makeid(6);
    let short_url = req.protocol + '://' + req.get('host') + '/';
    const record = URL.create({
      url,
      isObscured: isObscured === true,
      expiresAt,
      short_url: short_url += hash,
    });

    if (!record) throw new Error('Unable to create a record');
    
    // Set the stats asynchronously
    Index.findByIdAndUpdate(
      { _id: 'minifiedIndex' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    ).then((record, error) => {
      if (!error) {
        io.emit('minifiedIndex', record.seq);
      }
    });
    return record;
  }
  else{
    throw new Error(`URL isn't valid`);
  }
  
};

const redirect = (io) => async (req, res, next) => {
  if (!req.params.hash) return next();

  const record = await URL.findOne({ short_url: req.protocol + '://' + req.get('host') + '/' + req.params.hash });
  if (!record) return next();

  // Set the stats asynchronously
  Index.findByIdAndUpdate(
    { _id: 'visitedIndex' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  ).then((record, error) => {
    if (!error) {
      io.emit('visitedIndex', record.seq);
    }
  });

  return res.redirect(record.url);
};

const list = async () => {
  return URL.find({ });
};


module.exports = {
  minify,
  redirect,
  list,
};
