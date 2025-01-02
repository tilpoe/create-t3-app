import {
  type $FullRoute,
  type $FullRouter,
  type $LayoutRoute,
  type $LayoutRouter,
  type $Route,
  type $Router,
} from "~/router.gen";

declare global {
  type Route = $Route;
  type LayoutRoute = $LayoutRoute;
  type FullRoute = $FullRoute;
  type Router = $Router;
  type LayoutRouter = $LayoutRouter;
  type FullRouter = $FullRouter;
}
