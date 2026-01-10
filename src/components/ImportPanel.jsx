import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';

export default function ImportPanel({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [importData, setImportData] = useState('');
  const [importResult, setImportResult] = useState(null);

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importData);
      const result = await api.import.data(parsed);
      setImportResult(result);
    } catch (error) {
      setImportResult({ error: error.message });
    }
  };

  const sampleData = `{
  "categories": [
    {
      "name_en": "Food",
      "name_ar": "الطعام",
      "icon": "🍖",
      "order_index": 1,
      "items": [
        { "name_en": "Burgers", "name_ar": "برجر" },
        { "name_en": "Hot Dogs", "name_ar": "سجق" }
      ]
    }
  ]
}`;

  if (!isOpen) return null;

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-panel" onClick={(e) => e.stopPropagation()}>
        <div className="import-header">
          <h3>📥 {t.importData}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <textarea
          className="import-textarea"
          placeholder={t.importPlaceholder}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
        />

        <div className="import-actions">
          <button className="sample-btn" onClick={() => setImportData(sampleData)}>
            📝 Load Sample
          </button>
          <button className="import-btn" onClick={handleImport}>
            {t.importButton}
          </button>
        </div>

        {importResult && (
          <div className={`import-result ${importResult.error ? 'error' : 'success'}`}>
            {importResult.error ? (
              <p>❌ Error: {importResult.error}</p>
            ) : (
              <div>
                <p>✅ Success!</p>
                <p>Categories: {importResult.categoriesAdded}</p>
                <p>Items: {importResult.itemsAdded}</p>
                {importResult.errors.length > 0 && (
                  <div className="errors">
                    <p>⚠️ Errors:</p>
                    {importResult.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}