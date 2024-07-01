import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wrap } from '@hilma/tools';
import UserContextProvider from './common/context/userContext';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        wrap(
                React.StrictMode,
                [QueryClientProvider, { client: queryClient }],
                UserContextProvider,
        )(<App />)
);