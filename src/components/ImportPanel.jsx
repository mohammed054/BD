import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';

export default function ImportPanel({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [importData, setImportData] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [showFormat, setShowFormat] = useState(false);

const handleImport = async () => {
    try {
      if (!importData.trim()) {
        setImportResult({ error: 'Please enter JSON data to import' });
        return;
      }
      
      const parsed = JSON.parse(importData);
      
      // Validate structure before sending
      if (!parsed.categories && !parsed.uncategorizedItems) {
        setImportResult({ error: 'Must include either "categories" or "uncategorizedItems"' });
        return;
      }
      
      if (parsed.categories && !Array.isArray(parsed.categories)) {
        setImportResult({ error: '"categories" must be an array' });
        return;
      }
      
      if (parsed.uncategorizedItems && !Array.isArray(parsed.uncategorizedItems)) {
        setImportResult({ error: '"uncategorizedItems" must be an array' });
        return;
      }
      
      const result = await api.import.data(parsed);
      setImportResult(result);
      setImportData(''); // Clear after successful import
    } catch (error) {
      setImportResult({ error: error.message });
    }
  };

  const copyFormatToClipboard = () => {
    navigator.clipboard.writeText(sampleData);
    setImportResult({ success: true, message: 'Format copied to clipboard!' });
    setTimeout(() => setImportResult(null), 3000);
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

        <div className="import-actions" style={{ marginBottom: 'var(--spacing-md)' }}>
          <button 
            className="format-btn" 
            onClick={() => setShowFormat(!showFormat)}
            style={{ minHeight: '48px', background: 'linear-gradient(145deg, var(--accent-cyan) 0%, var(--accent-secondary) 100%)' }}
          >
            📋 {showFormat ? 'Hide Format' : 'Show Format'}
          </button>
          <button 
            className="copy-format-btn" 
            onClick={copyFormatToClipboard}
            style={{ minHeight: '48px', background: 'linear-gradient(145deg, var(--accent-success) 0%, #00b894 100%)' }}
          >
            📥 Copy Format
          </button>
        </div>

        {showFormat && (
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '2px dashed var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--spacing-md)', 
            marginBottom: 'var(--spacing-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            lineHeight: '1.6',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {importSyntax}
          </div>
        )}

        <textarea
          className="import-textarea"
          placeholder={t.importPlaceholder || 'Paste your JSON data here...'}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          style={{ 
            minHeight: '200px',
            width: '100%',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: "'Courier New', monospace",
            fontSize: 'var(--font-size-sm)',
            resize: 'vertical'
          }}
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
          <div className={`import-result ${importResult.error || importResult.success ? 'success' : 'error'}`} style={{ 
            padding: 'var(--spacing-md)', 
            borderRadius: 'var(--radius-md)', 
            marginTop: 'var(--spacing-md)',
            background: importResult.error ? 'var(--accent-orange)' : 'var(--accent-success)',
            color: 'var(--bg-primary)',
            border: `2px solid ${importResult.error ? 'var(--accent-orange)' : 'var(--accent-success)'}`
          }}>
            {importResult.error ? (
              <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', margin: 0 }}>
                ❌ Error: {importResult.error}
              </p>
            ) : importResult.message ? (
              <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', margin: 0 }}>
                ✅ {importResult.message}
              </p>
            ) : (
              <div>
                <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ✅ Import Successful!
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  📦 Categories: {importResult.categoriesAdded}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  🎁 Items: {importResult.itemsAdded}
                </p>
                {importResult.errors.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid rgba(255,255,255,0.3)' }}>
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
