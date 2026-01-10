import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import GuestList from './components/GuestList';
import UncategorizedItems from './components/UncategorizedItems';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
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
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;