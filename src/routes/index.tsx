import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StackRoutes } from './stack.routes';

export default function Routes() {
  return (
    <NavigationContainer>

      <StackRoutes />
      {/* <DrawerRoutes /> */}
      {/* <TabRoutes /> */}

    </NavigationContainer>
  );
}
