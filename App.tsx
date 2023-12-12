
import React from 'react';
import 'react-native-gesture-handler';

// import { useColorScheme } from 'react-native';

// import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { getMainDatabase } from './src/libs/notion';
import Routes from './src/routes';
import { NotionProvider } from './src/contexts/NotionContext';
import { Toast } from './src/components/Toast/Toast';

function App() {
  console.log('app is starting');

  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // getMainDatabase();


  return (
    <NotionProvider>
      {/* Only use ToastProvider if it is using Context implementation.
    Zustand implementation doesn't need a provider */}
      {/* <ToastProvider> */}
      <Routes />
      <Toast />
      {/* </ToastProvider> */}
    </NotionProvider>
  );
}

export default App;
