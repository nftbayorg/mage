export const timeRemaining = (endDate: Date): string => {
  const maybeAddLeadingZero = (number: number): string => [String(number).length === 1 ? '0' : '', number].join('');
  
  const deltaInSeconds = Math.abs(Date.now() - endDate.valueOf()) / 1000;

  const days = Math.floor(deltaInSeconds / 86400);
  const deltaMinusDaysInSeconds = deltaInSeconds - days * 86400;

  const hours = Math.floor(deltaMinusDaysInSeconds / 3600) % 24;
  const deltaMinusHoursInSeconds = deltaMinusDaysInSeconds - hours * 3600;

  const minutes = Math.floor(deltaMinusHoursInSeconds / 60) % 60;
  const twoDigitMinutes = maybeAddLeadingZero(minutes);
  const deltaMinusMinutesInSeconds = deltaMinusHoursInSeconds - minutes * 60;

  const seconds = Math.floor(deltaMinusMinutesInSeconds % 60);
  const twoDigitSeconds = maybeAddLeadingZero(seconds);

  if (days > 0) return `${days} ${days > 1 ? 'days' : 'day'}`;
  if (hours > 1) return `${hours} hours`;
  if (minutes > 10) return `${twoDigitMinutes} mins`;
  if (minutes >= 1) return `${twoDigitMinutes} mins ${twoDigitSeconds} secs`;

  return `${twoDigitSeconds} secs`;
}
