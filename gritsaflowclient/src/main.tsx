import ReactDOM from "react-dom/client";
import './App.css';
import App from "./App";

import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import "@ant-design/v5-patch-for-react-19";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CookiesProvider } from 'react-cookie';


const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => toast.error(`Something went wrong: ${error.message}`),
    }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
            </Provider>
        </QueryClientProvider>
    </CookiesProvider>
);


