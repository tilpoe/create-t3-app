declare global {
  type SearchParams = Record<string, string | string[] | undefined>;

  interface Layout<TRoute extends LayoutRoute> {
    children: Readonly<React.ReactNode>;
    params: Promise<LayoutRouter[TRoute]["params"]>;
  }

  interface Page<TRoute extends Route> {
    params: Promise<Router[TRoute]["params"]>;
    searchParams: Promise<SearchParams>;
  }

  type PageParams<TRoute extends Route> = Router[TRoute]["params"];
}
