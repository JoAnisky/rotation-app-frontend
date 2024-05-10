import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { routerType } from "./router.types";
import pagesData from "./pagesData";
import PrivateRoute from './PrivateRoute'; // Assurez-vous que le chemin d'importation est correct

const Router = (): ReactElement => {
  const pageRoutes = pagesData.map(({ path, title, element, protected: isProtected }: routerType) => {
    const routeElement = (
      <Route key={title} path={`/${path}`} element={element} />
    );

    // Si la route est protégée, l'envelopper dans PrivateRoute
    return isProtected ? (
      <Route key={title} path={`/${path}`} element={<PrivateRoute />}>
        {routeElement}
      </Route>
    ) : routeElement;
  });

  return <Routes>{pageRoutes}</Routes>;
};

export default Router;