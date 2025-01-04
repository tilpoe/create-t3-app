declare global {
  type SearchParams = Record<string, string | string[] | undefined>;

  interface Layout<
    TParams extends Record<string, unknown> = Record<string, unknown>,
  > {
    children: Readonly<React.ReactNode>;
    params: Promise<TParams>;
  }

  interface Page<
    TParams extends Record<string, unknown> = Record<string, unknown>,
  > {
    params: Promise<TParams>;
    searchParams: Promise<SearchParams>;
  }
}
