import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import GuestList from './components/GuestList';
import ImportPanel from './components/ImportPanel';
import './App.css';

function App() {
  const [showImport, setShowImport] = useState(false);

  return (
    <LanguageProvider>
      <UserProvider>
        <div className="app">
          <Header />

          <div className="main-content">
            <div className="left-panel">
              <GuestList />
            </div>

            <div className="right-panel">
              <CategoryList />
            </div>
          </div>

          <button
            className="import-toggle-btn"
            onClick={() => setShowImport(!showImport)}
          >
            📥 Import
          </button>

          <ImportPanel isOpen={showImport} onClose={() => setShowImport(false)} />
        </div>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;