import { NextRequest, NextResponse } from "next/server";

import { localeIdentifiers } from "./src/locales";

const locales = [...localeIdentifiers.map((locale) => locale.market)];

//ref: https://www.erichowey.dev/writing/advanced-internationalization-with-nextjs-and-middleware/
const PUBLIC_FILE = /\.(.*)$/;
const FF_LOCALE_COOKIE = "FF_LOCALE";

export async function middleware(nextRequest: NextRequest) {
  console.log("middleware running");
  // Get the information we need from the request object
  const { nextUrl, headers, cookies: nextCookies } = nextRequest;

  try {
    // Early return if it is a public file such as an image
    if (PUBLIC_FILE.test(nextUrl.pathname)) {
      return undefined;
    }

    // Early return if this is an api route
    if (nextUrl.pathname.includes("/api")) {
      return undefined;
    }

    // Early return if not frontpage - Redirect all urls would require calling the bff
    // For now we only redirect from frontpage
    if (nextUrl.pathname !== "/") {
      return undefined;
    }

    const pathNameLocale = nextUrl.pathname.split("/")[1];
    const localeIsValid = locales.includes(pathNameLocale);

    // Client country, defaults to us
    //   const country = geo?.country?.toLowerCase() || "us";

    // Client language, defaults to en
    const language =
      headers
        .get("accept-language")
        ?.split(",")?.[0]
        .split("-")?.[0]
        .toLowerCase() || "en";

    console.log("language", language);
    // Helpful console.log for debugging
    // console.log({
    //   nextLocale: nextUrl.locale || "doesnt work on netlify",
    //   pathNameLocale,
    //   pathname: nextUrl.pathname,
    //   cookie: localeCookie,
    //   clientCountry: country,
    //   clientLanguage: language,
    // });

    // Early return if we are on a locale other than default
    if (localeIsValid) {
      return undefined;
    }

    // Cloned url to work with
    const url = nextUrl.clone();

    // Get locale cookie
    const localeCookie = nextCookies.get(FF_LOCALE_COOKIE);

    // Early return if there is a cookie present and the cookie is not the locale from the url
    if (localeCookie) {
      url.pathname = `/${localeCookie}${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // We now know:
    // No cookie that we need to deal with
    // User has to be on default locale

    // Redirect All danish language
    if (language === "da" || language === "da-DK") {
      url.pathname = `/da-DK${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // Handle the default locale fallback to english
    // if (nextUrl.locale === "default") {
    //   url.pathname = `/en${nextUrl.pathname}`;
    //   return NextResponse.redirect(url);
    // }

    // If everything else falls through continue on with response as normal
    return undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const config = {
  matcher: ["/"], // paths on which middleware will work
};
