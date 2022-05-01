## When SSR and SSG is used, and goals and requirements for SSR and SSG

* SSR is used on pages that benefit from it due to SEO (e.g. Deck pages).
  * Most pages don't benefit from SSR, and should not have logic to use it.
  * The cache is useful only when we are fine with partially optimistic data, it's not that useful for SSR; we prefer consistent data at time of render
    * If we want to reduce load time, cache the entire rendered page; this is a solution possible on server but not preferable on the client in favor of a state store. (i.e. fully optimistic yet consistent data)

## How `urql` is used on SSR and SSG pages

* We only use `next-urql` features that do not require `getInitialProps`.
* For convenience, we wrap `withUrqlClient` on `_app.tsx`, rather than individual pages. Because of `ssr: false`, `getInitialProps` is not auto-defined and so we do not break automatic SSG optimization.
* When we wish to pre-render content as SSR and SSG, we follow https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#using-getstaticprops-or-getserversideprops .
* `withDefaultUrqlClient` and `initDefaultUrqlClient` manage the construction of the separate clients, namely
  * the client used to populate the cache in `getStaticProps` and `getServerProps` (`initDefaultUrqlClient`),
  * the client used to transform the cache into a query response underlying the `useQuery`, etc. hooks (`withDefaultUrqlClient`, in a server context),
  * the browser client (`withDefaultUrqlClient`, in a browser context)

See: https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/
