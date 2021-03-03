export enum LanguageCodesEnum {
  UnitedStates = 'en-US',
}

export enum CurrencyCodesEnum {
  UnitedStates = 'USD',
}

export interface I18NType {
  language: LanguageCodesEnum;
  currency: CurrencyCodesEnum;
}

type I18NTypeKeys = 'unitedStates';

export const I18NTypes: Record<I18NTypeKeys, I18NType> = {
  unitedStates: {
    language: LanguageCodesEnum.UnitedStates,
    currency: CurrencyCodesEnum.UnitedStates,
  },
};

/*
  Keep this up to date with src/constants/i18n.ts
  until I figure out why the hell TS complains
  about exporting type aliases
*/

class I18NService {
  private locale: I18NType;

  constructor(locale: I18NTypeKeys = 'unitedStates') {
    this.locale = I18NTypes[locale];
  }

  unformat(value: string, decimal = '.', fallback = 0) { // eslint-disable-line class-methods-use-this
    // Return the value as-is if it's already a number
    if (typeof value === 'number') return value;

    // Build regex to strip out everything except digits, decimal point and minus sign
    const regex = new RegExp(`[^0-9-(-)-${decimal}]`, 'g');
    const unformattedValueString
        = (`${value}`)
          .replace(regex, '') // strip out any cruft
          .replace(decimal, '.') // make sure decimal point is standard
          .replace(/\(([-]*\d*[^)]?\d+)\)/g, '-$1') // replace bracketed values with negatives
          .replace(/\((.*)\)/, ''); // remove any brackets that do not have numeric value

    /**
     * Handling -ve number and bracket, eg.
     * (-100) = 100, -(100) = 100, --100 = 100
     */

    const negative = (unformattedValueString.match(/-/g)?.length || 2) % 2;
    const absUnformatted = parseFloat(unformattedValueString.replace(/-/g, ''));
    const unformatted = absUnformatted * ((negative) ? -1 : 1);

    // This will fail silently which may cause trouble, let's wait and see
    return !isNaN(unformatted) ? unformatted : fallback; // eslint-disable-line no-restricted-globals
  }

  getFormattedPrice(
    price: number,
    precision = 0,
  ): string {
    const {
      language,
      currency,
    } = this.locale;

    return new Intl.NumberFormat(
      language,
      {
        style: 'currency',
        currency,
        minimumFractionDigits: precision,
      },
    ).format(price);
  }
}

export const i18NService = new I18NService();
