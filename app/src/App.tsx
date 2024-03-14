import { BrowserRouter, useRoutes } from 'react-router-dom';
import { TRPCProvider } from './applications/utils';
import { Frame } from './layout/Frame';

import example from './applications/example/Example';
import website from './applications/website/Website';
import socialWizard from './applications/social/social-wizard';
import Home from './applications/home'


export const Applications = [example, website, socialWizard];

const ApplicationRouteManager = () => {
  const navigation = Applications.flatMap(app => app.navigation);
  const dashboard = Applications.flatMap(app => app.routes.dashboard);
  const standalone = Applications.flatMap(app => app.routes.standalone);

  return useRoutes([
    {
      element: <TRPCProvider />,
      children: [
        { path: '/', element: <Frame navigation={navigation} />, children: [
          { children: [
            { index: true, element: <Home /> },
            ...dashboard
          ] }
       ] },
        { children: standalone }
      ]
    }
  ]);
};

function App() {
  return (
    <BrowserRouter>
      <ApplicationRouteManager />
    </BrowserRouter>
  );
}

export default App;
