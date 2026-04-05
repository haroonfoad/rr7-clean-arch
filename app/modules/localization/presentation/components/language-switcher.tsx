import { useLocation, useNavigate } from "react-router";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
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

  const buildLocalizedHref = (nextLocale: AppLocale) => {
    const segments = location.pathname.split("/").filter(Boolean);
    const hasLocalePrefix = SUPPORTED_LOCALES.includes(
      (segments[0] ?? "") as AppLocale,
    );
    const rest = hasLocalePrefix ? segments.slice(1) : segments;
    const nextPath =
      rest.length > 0 ? `/${nextLocale}/${rest.join("/")}` : `/${nextLocale}`;

    return `${nextPath}${location.search}${location.hash}`;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="locale" className="text-sm font-medium text-slate-600">
        {t("language.label")}
      </label>
      <Dropdown
        inputId="locale"
        value={locale}
        options={SUPPORTED_LOCALES.map((candidate) => ({
          label: candidate,
          value: candidate,
        }))}
        onChange={(event: DropdownChangeEvent) => {
          const nextLocale = event.value as AppLocale;
          navigate(buildLocalizedHref(nextLocale));
        }}
        aria-label={t("language.label")}
      />
    </div>
  );
}
