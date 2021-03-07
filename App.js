import React from 'react';
import TabView from './src/TabView';

const screensData = [
  {
    color: '#fe7058',
    content: 'screen a',
  },
  {
    color: '#fcd463',
    content: 'screen b',
  },
  {
    color: '#89c5cd',
    content: 'screen c',
  },
  {
    color: 'dodgerblue',
    content: 'screen d',
  },
  {
    color: 'black',
    content: 'screen e',
  },
];

const App = () => {
  return (
    <TabView screensData={screensData} preloadNumber={1} isPreload={true} />
  );
};

export default App;
