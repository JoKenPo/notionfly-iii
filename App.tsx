
import React from 'react';
import 'react-native-gesture-handler';

// import { useColorScheme } from 'react-native';

// import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { getMainDatabase } from './src/libs/notion';
import Routes from './src/routes';
import { NotionProvider } from './src/contexts/NotionContext';

function App() {
  console.log('app is starting');

  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // getMainDatabase();


  return (
    <NotionProvider>
      <Routes />
    </NotionProvider>
  );
}

export default App;
