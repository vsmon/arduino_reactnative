import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import Home from './pages/Home/';
import Configuration from './pages/Configuration';

export default createAppContainer(
  createSwitchNavigator({
    Home,
    Configuration,
  }),
);
