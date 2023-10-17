import { BrowserRouter, useRoutes } from 'react-router-dom';

import example from './applications/example/Example';
import { TRPCProvider } from './applications/utils';
import website from './applications/website/Website';
import { Frame } from './layout/Frame';

const Applications = [example, website];

const ApplicationRouteManager = () => {
  const navigation = Applications.flatMap(app => app.navigation);
  const dashboard = Applications.flatMap(app => app.routes.dashboard);
  const standalone = Applications.flatMap(app => app.routes.standalone);

  return useRoutes([
    {
      element: <TRPCProvider />,
      children: [
        { path: '/', element: <Frame navigation={navigation} />, children: [{ children: dashboard }] },
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
