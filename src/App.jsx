import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import GuestList from './components/GuestList';
import GuestSelection from './components/GuestSelection';
import UncategorizedItems from './components/UncategorizedItems';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

function AppContent() {
  const { isRegistered } = useUser();

  if (!isRegistered) {
    return <GuestSelection />;
  }

  return (
    <div className="app">
      <ConnectionStatus />
      <Header />

      <div className="main-content">
        <div className="left-panel">
          <GuestList />
        </div>

        <div className="right-panel">
          <UncategorizedItems />
          <CategoryList />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;