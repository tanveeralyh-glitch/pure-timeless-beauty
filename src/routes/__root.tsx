import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-eyebrow text-gold">Aurelia Skin</p>
        <h1 className="mt-4 font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-2 font-display text-2xl text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This page has drifted beyond our shelves.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.28em] text-background transition hover:bg-foreground/85"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">A moment of stillness</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something interrupted the page. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.28em] text-background hover:bg-foreground/85"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.28em] text-foreground hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aurelia Skin — Pure Science. Timeless Beauty." },
      { name: "description", content: "An ultra-luxury skincare house crafting rituals from pure botanicals and clinical science. Discover Aurelia's radiance collection." },
      { name: "author", content: "Aurelia Skin" },
      { property: "og:title", content: "Aurelia Skin — Pure Science. Timeless Beauty." },
      { property: "og:description", content: "An ultra-luxury skincare house crafting rituals from pure botanicals and clinical science. Discover Aurelia's radiance collection." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Aurelia Skin" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#FAF8F6" },
      { name: "twitter:title", content: "Aurelia Skin — Pure Science. Timeless Beauty." },
      { name: "twitter:description", content: "An ultra-luxury skincare house crafting rituals from pure botanicals and clinical science. Discover Aurelia's radiance collection." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f9211a9c-6040-4583-93eb-b1cc096c58e2/id-preview-b8480d56--1268e033-c966-444e-b62a-a96db49a6d5b.lovable.app-1784138073398.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f9211a9c-6040-4583-93eb-b1cc096c58e2/id-preview-b8480d56--1268e033-c966-444e-b62a-a96db49a6d5b.lovable.app-1784138073398.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
