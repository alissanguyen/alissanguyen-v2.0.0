import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useLocation,
  useLoaderData
} from "@remix-run/react";
import React from "react";

import stylesheet from "~/tailwind.css";

import globalStyles from "../app/styles/global.css";

import ErrorPage from "./components/Error/ErrorPage";
import errorPageStyles from "./components/Error/ErrorPage.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/NavBar/NavBar";
import navbarStyleSheet from "./components/NavBar/NavBar.css";
import themeBtnStyles from "./components/ThemeButton/ThemeButton.css";
import { ModalContextProvider } from "./providers/ModalProvider";
import { ThemeContextProvider, useTheme } from "./providers/ThemeProvider";
import { SupportedTheme } from "./types";
import { getThemeSession } from "./utils/theme.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: themeBtnStyles },
  { rel: "stylesheet", href: navbarStyleSheet },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: errorPageStyles },
  {
    rel: "stylesheet",
    href: "/fonts/zen_kaku_gothic_antique.css"
  },
  {
    rel: "stylesheet",
    href: "/fonts/pacifico.css"
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png"
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png"
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png"
  },
  {
    rel: "manifest",
    href: "/site.webmanifest"
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeValue = await getThemeSession(request);
  return {
    theme: themeValue.getTheme()
  };
};

const convertSupportedThemeToClassName = (
  theme: SupportedTheme,
  onBlogRoute: boolean
): string => {
  if (theme === SupportedTheme.LIGHT) {
    if (onBlogRoute) {
      return "light-theme light-theme-blog";
    }
    return "light-theme";
  } else {
    if (onBlogRoute) {
      return "dark-theme dark-theme-blog";
    }
    return "dark-theme";
  }
};

interface LoaderData {
  theme: SupportedTheme;
}

function App() {
  const { theme } = useLoaderData<LoaderData>();

  return (
    <ThemeContextProvider initialTheme={theme}>
      <ModalContextProvider>
        <Document>
          <Layout>
            <Outlet />
          </Layout>
        </Document>
      </ModalContextProvider>
    </ThemeContextProvider>
  );
}
interface Props {
  children: React.ReactNode;
}

const Document: React.FC<Props> = ({ children }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const onBlogRoute = location.pathname.startsWith("/blog");
  React.useEffect(() => {
    /**
     * We want to add this class that makes background color transitions smooth
     * only after the initial render. If the initial markup has this rule applied
     * then users on dark-mode see a flash of unthemed content which then
     * transitions to dark mode.
     *
     * By doing this after the initial paint, only further theme switches will
     * have the background-color transition animation
     */
    document.body.classList.add("Background__ColorTransition--short");
  }, []);
  return (
    <html
      lang="en"
      className={`${convertSupportedThemeToClassName(theme, onBlogRoute)}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {process.env.NODE_ENV === "production" ? (
          <base href="https://www.alissanguyen.dev"></base>
        ) : null}
        <Meta />
        <Links />
      </head>
      <body id="root" className="h-full">
        <script
          async
          src="https://platform.twitter.com/widgets.js"
        ></script>
        <noscript>
          <div
            style={{
              backgroundColor: "black",
              color: "white",
              padding: 30
            }}
          >
            <p style={{ fontSize: "1.5em" }}>
              This site works much better with JavaScript enabled...
            </p>
          </div>
        </noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload port={Number(process.env.REMIX_DEV_SERVER_WS_PORT)} /> : null}
      </body>
    </html>
  );
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="Document__Content screen-body">{children}</div>
      <Footer />
    </>
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  const location = useLocation();
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>Oh no...</title>
        <Links />
      </head>
      <body id="root">
        <div className="app tracking-wide text-lg overflow-hidden">
          <ErrorPage
            error={error}
            heroMsg="500 - Oh no, something did not go well."
            pathname={location.pathname}
            subMsg="is currently not working. So sorry."
          />
        </div>
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

interface RouteError {
  status: number;
  statusText: string;
  // Add any other properties that the error object may have
}

export const CatchBoundary: React.FC<Props> = ({ children }) => {
  const caught = useRouteError() as RouteError;
  const location = useLocation();
  if (caught.status === 404) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <title>404 - Oh no...</title>
          <Links />
        </head>
        <body id="root">
          <noscript>
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                padding: 30
              }}
            >
              <p style={{ fontSize: "1.5em" }}>
                This site works much better with JavaScript enabled...
              </p>
            </div>
          </noscript>
          <div className="app tracking-wide">
            <ErrorPage
              heroMsg="404 - Oh no, you found a page that's missing stuff."
              pathname={location.pathname}
              subMsg="is not a page on alissanguyen.dev. So sorry."
            />
          </div>
          {children}
        </body>
      </html>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
};

export default App;

