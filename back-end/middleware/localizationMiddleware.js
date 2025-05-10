const i18n = require('i18n');

module.exports = (req, res, next) => {
    const supportedLanguages = ['en', 'uk'];
    const userLanguage = req.acceptsLanguages(supportedLanguages) || 'en';
    console.log(userLanguage)
    i18n.setLocale(userLanguage);

    next();
}