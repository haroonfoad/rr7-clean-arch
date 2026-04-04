import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import type { AppLocale } from "../../domain/entities/locale";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from "../../domain/entities/locale";
import {
  DEFAULT_NAMESPACE,
  resources,
} from "../../infrastructure/i18n/resources";

type LocalizationProviderProps = {
  locale: AppLocale;
  children: React.ReactNode;
};

export function LocalizationProvider({
  locale,
  children,
}: LocalizationProviderProps) {
  const instance = useMemo(() => {
    const created = i18next.createInstance();
    void created.use(initReactI18next).init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...SUPPORTED_LOCALES],
      defaultNS: DEFAULT_NAMESPACE,
      ns: [DEFAULT_NAMESPACE],
      resources,
      interpolation: { escapeValue: false },
      initImmediate: false,
    });

    return created;
  }, [locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
