'use strict';

const Translator = require('../components/translator.js');
const translator = new Translator();

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body
      
      if (!locale || text === undefined) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      if (text === '') {
        res.json({ error: 'No text to translate' });
        return;
      }
      let translation;
      if (locale === "american-to-british") {
        translation = translator.americanToBritish(text);
      } else if (locale === "british-to-american") {
        translation = translator.britishToAmerican(text);
      } else {
        res.json({ error: 'Invalid value for locale field' });
        return;
      }
      if (!translation) {
        translation = 'Everything looks good to me!';
      }
      res.json({ text, translation });
    });
};
