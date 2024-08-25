import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import "../src/styles/global.css"
import theme from "../src/styles/theme/theme.js"
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import 'react-phone-number-input/style.css';
import 'react-international-phone/style.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider
     store={store}
     >
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
)
