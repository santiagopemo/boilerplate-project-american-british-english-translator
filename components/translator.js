const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const britishToAmericanSpelling = reverseObject(americanToBritishSpelling);
const britishToAmericanTitles = reverseObject(americanToBritishTitles);

class Translator {
  americanToBritish(text) {
    if (!text) {
      return undefined;
    }
    const dict = {...americanOnly,  ...americanToBritishSpelling};
    const titles = americanToBritishTitles;
    const timeRegex = /([1-9]|1[012]):[0-5][0-9]/g;    
    return this.translate(text, dict, titles, timeRegex, ':', '.');
  }
  
  britishToAmerican(text) {
    if (!text) {
      return undefined;
    }
    const dict = {...britishOnly,  ...britishToAmericanSpelling};
    const titles = britishToAmericanTitles;
    const timeRegex = /([1-9]|1[012])\.[0-5][0-9]/g;    
    return this.translate(text, dict, titles, timeRegex, '.', ':');
  }

  translate (text, dict, titles, timeRegex, timeChar, replaceTimeChar) {
    if (!text || !dict || !titles || !timeRegex) {
      return undefined;
    }
    const lowerCaseText = text.toLowerCase();
    const keysWithSpaces = Object.fromEntries(Object.entries(dict).filter(([k, v]) => k.includes(' ')));
    const matches = {}
    Object.entries(keysWithSpaces).map(([key, value]) => {
      if (lowerCaseText.includes(key)) {
        matches[key] = value;
      }
    });

    Object.entries(titles).map(([key, value]) => {
      if (lowerCaseText.includes(key)) {
        matches[key] = value[0].toUpperCase() + value.slice(1);
      }
    });

    const wordsInText = lowerCaseText.match(/\w+([-'](\w)+)*/gi);
    wordsInText.forEach((word) => {
      if (dict[word]) {
        matches[word] = dict[word];
      } 
    });

    const times = lowerCaseText.match(timeRegex);

    if (times) {
      times.map(time => matches[time] = time.replace(timeChar, replaceTimeChar));
    }
    
    if (Object.keys(matches).length === 0) {
      return undefined;
    }

    const translateRegex = new RegExp(Object.keys(matches).join('|'), 'gi')
    
    return text.replace(translateRegex, (matched) => `<span class="highlight">${matches[matched.toLowerCase()]}</span>`);
  }
}
function reverseObject (object) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
}

module.exports = Translator;