import type { Resource } from "i18next";

import arCommon from "./locales/ar/common.json";
import enCommon from "./locales/en/common.json";
import ruCommon from "./locales/ru/common.json";

export const DEFAULT_NAMESPACE = "common";

export const resources: Resource = {
  en: { common: enCommon },
  ar: { common: arCommon },
  ru: { common: ruCommon },
};
