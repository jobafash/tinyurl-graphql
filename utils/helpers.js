'use strict';

const checkUrl = (url) => {
    let regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let valid = true;

    // Test if url is correct
    if (regexp.test(url) !== true) {
      valid = false;
    }

    return valid;
  };
const makeid = (length) => {
    let result = [];
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
  }

module.exports = {
    checkUrl,
    makeid,
  };