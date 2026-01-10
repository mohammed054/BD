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
        { "name_en": "Burgers", "name_ar": "برجر", "price": 5.50 },
        { "name_en": "Hot Dogs", "name_ar": "سجق", "price": 3.00 }
      ]
    }
  ],
  "uncategorizedItems": [
    { "name_en": "Drinks", "name_ar": "مشروبات", "price": 2.00 }
  ]
}`;

  const importSyntax = `📥 Import Data Format:

Categories (optional):
{
  "categories": [
    {
      "name_en": "Category Name (English)",
      "name_ar": "اسم الفئة (عربي)",
      "icon": "📦 (emoji, optional)",
      "order_index": 1 (optional),
      "items": [
        {
          "name_en": "Item Name (English)",
          "name_ar": "اسم العنصر (عربي)",
          "price": 10.00 (optional)
        }
      ]
    }
  ]
}

Uncategorized Items (optional):
{
  "uncategorizedItems": [
    {
      "name_en": "Item Name",
      "name_ar": "اسم العنصر",
      "price": 15.00 (optional)
    }
  ]
}

📌 Tips:
- Items without price default to 0
- You can use both "categories" and "uncategorizedItems" together
- All fields are optional except for item names
- JSON must be valid (check with JSONLint if needed)`;

  if (!isOpen) return null;

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-panel" onClick={(e) => e.stopPropagation()}>
        <div className="import-header">
          <h3 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>
            📥 {t.importData}
          </h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ 
          background: 'var(--bg-card)', 
          border: '2px dashed var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          padding: 'var(--spacing-md)', 
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-line',
          lineHeight: '1.6'
        }}>
          {importSyntax}
        </div>

        <textarea
          className="import-textarea"
          placeholder={t.importPlaceholder}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
        />

        <div className="import-actions">
          <button 
            className="sample-btn" 
            onClick={() => setImportData(sampleData)}
            style={{ minHeight: '48px' }}
          >
            📝 Load Sample
          </button>
          <button 
            className="import-btn" 
            onClick={handleImport}
            style={{ minHeight: '48px' }}
          >
            {t.importButton}
          </button>
        </div>

        {importResult && (
          <div className={`import-result ${importResult.error ? 'error' : 'success'}`}>
            {importResult.error ? (
              <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                ❌ Error: {importResult.error}
              </p>
            ) : (
              <div>
                <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ✅ Success!
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  📦 Categories: {importResult.categoriesAdded}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  🎁 Items: {importResult.itemsAdded}
                </p>
                {importResult.errors.length > 0 && (
                  <div className="errors" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--border-color)' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                      ⚠️ Errors:
                    </p>
                    {importResult.errors.map((err, i) => (
                      <p key={i} style={{ margin: '0.25rem 0' }}>
                        {err}
                      </p>
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
