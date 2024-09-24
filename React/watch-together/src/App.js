import './App.css';
import AuthProvider from './components/AuthProvider';
import Routes from './components/Routes';
import ErrorBoundary from './components/ErrorBoundary';

export const serverURL = "localhost:8000";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
