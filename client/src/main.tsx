import ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import UserProvider from './common/context/userContext';
import App from './App';

import { wrap } from '@hilma/tools';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        wrap(
                [QueryClientProvider, { client: queryClient }],
                UserProvider,
        )(<App />)
);