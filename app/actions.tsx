export function setLocale(locale: string): void {
  document.cookie = "NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `NEXT_LOCALE=${locale}; path=/;`;
}

export function getLocale(): string | undefined {
  const cookie: Record<string, string> = {};
  const cookies: string = document.cookie;
  cookies.split(';').forEach((el: string) => {
    const split: string[] = el.split('=');
    cookie[split[0].trim()] = split.slice(1).join("=");
  });
  return cookie['NEXT_LOCALE'];
}
