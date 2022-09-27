export const DateAsMonthYearAsWords = (date: Date) => {
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    
  });

  return `${longEnUSFormatter.format(date)
  }`
}

export const DateAsWord = (date: Date): string => {
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pluralRules = new Intl.PluralRules("en-US", {
    type: "ordinal",
  });

  interface Suffixes {
    [key: string]: string | undefined;
  }

  const suffixes: Suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };
  const convertToOrdinal = (number: number) =>
    `${number}${suffixes[pluralRules.select(number)]}`;

    const extractValueAndCustomizeDayOfMonth = (
    part: Intl.DateTimeFormatPart
  ) => {
    if (part.type === "day") {
      return convertToOrdinal(+part.value);
    }
    return part.value;
  };

  return `${longEnUSFormatter
    .formatToParts(date)
    .map(extractValueAndCustomizeDayOfMonth)
    .join("")} ${date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  })}`;
};
