import ReactDOM from 'react-dom/client';
import React from 'react';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import UserProvider from './common/context/userContext';
import SocketProvider from './common/context/socketContext';
import App from './App';

import { wrap } from '@hilma/tools';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        wrap(
                React.StrictMode,
                [QueryClientProvider, { client: queryClient }],
                SocketProvider,
                UserProvider,
        )(<App />)
);