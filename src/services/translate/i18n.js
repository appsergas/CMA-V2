import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { I18nManager } from 'react-native';

export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  ar: () => require('./locales/ar.json'),
  en: () => require('./locales/en.json'),
};

export const t = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const getDefaultLanguage = async () => {
  const { languageTag, isRTL } = await RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters))
  return languageTag
}

export const setI18nDefaultConfig = () => {
  //use for finding best language in your system
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters))


  // clear translation cache
  t.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export const setI18nConfig = (language, isRtl) => {
  const fallback = { languageTag: language, isRTL: isRtl };
  const { languageTag, isRTL } = fallback;


  // clear translation cache
  t.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};