import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LOCALE,
  type AppLocale,
  SUPPORTED_LOCALES,
} from "../../domain/entities/locale";
import { DEFAULT_NAMESPACE, resources } from "./resources";

export async function createI18nInstance(locale: AppLocale): Promise<i18n> {
  const instance = i18next.createInstance();

  await instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    defaultNS: DEFAULT_NAMESPACE,
    ns: [DEFAULT_NAMESPACE],
    resources,
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

  return instance;
}
