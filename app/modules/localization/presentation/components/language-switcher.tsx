import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import {
  SUPPORTED_LOCALES,
  type AppLocale,
} from "../../domain/entities/locale";

type LanguageSwitcherProps = {
  locale: AppLocale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="locale" className="text-xs text-slate-600">
        {t("language.label")}
      </label>
      <select
        id="locale"
        name="locale"
        defaultValue={locale}
        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
        onChange={(event) => {
          const nextLocale = event.currentTarget.value as AppLocale;
          const segments = location.pathname.split("/").filter(Boolean);
          const hasLocalePrefix = SUPPORTED_LOCALES.includes(
            (segments[0] ?? "") as AppLocale,
          );
          const rest = hasLocalePrefix ? segments.slice(1) : segments;
          const nextPath =
            rest.length > 0
              ? `/${nextLocale}/${rest.join("/")}`
              : `/${nextLocale}`;

          navigate(`${nextPath}${location.search}${location.hash}`);
        }}
      >
        {SUPPORTED_LOCALES.map((candidate) => (
          <option key={candidate} value={candidate}>
            {t(`language.${candidate}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
