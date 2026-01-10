import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import { AnimatePresence, motion } from 'framer-motion';

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

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const panelVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -10
    },
    show: { 
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const resultVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.9
    },
    show: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className="import-overlay" 
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.div 
        className="import-panel" 
        onClick={(e) => e.stopPropagation()}
        variants={panelVariants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <div className="import-header">
          <motion.h3
            animate={{ 
              textShadow: [
                "2px 2px 0 var(--accent-primary)",
                "4px 4px 0 var(--accent-secondary)",
                "2px 2px 0 var(--accent-primary)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}
          >
            📥 {t.importData}
          </motion.h3>
          <motion.button 
            className="close-btn" 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-primary)',
              color: 'var(--text-primary)',
              border: '3px solid var(--accent-primary)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--font-size-xl)',
              minWidth: '48px',
              minHeight: '48px'
            }}
          >
            ✕
          </motion.button>
        </div>

        <motion.textarea
          className="import-textarea"
          placeholder={t.importPlaceholder}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          whileFocus={{ scale: 1.01 }}
          animate={importData ? {
            borderColor: [
              "var(--border-color)",
              "var(--accent-primary)",
              "var(--border-color)"
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="import-actions">
          <motion.button 
            className="sample-btn" 
            onClick={() => setImportData(sampleData)}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: 'var(--accent-secondary)',
              border: '3px solid var(--accent-secondary)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'bold',
              minHeight: '48px',
              color: 'var(--bg-primary)'
            }}
          >
            📝 Load Sample
          </motion.button>
          <motion.button 
            className="import-btn" 
            onClick={handleImport}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: 'var(--accent-primary)',
              border: '3px solid var(--accent-primary)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'bold',
              minHeight: '48px',
              color: 'var(--text-primary)'
            }}
          >
            {t.importButton}
          </motion.button>
        </div>

        <AnimatePresence mode="popLayout">
          {importResult && (
            <motion.div 
              className={`import-result ${importResult.error ? 'error' : 'success'}`}
              variants={resultVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {importResult.error ? (
                <motion.p
                  animate={{ 
                    x: [0, -5, 5, 0],
                    color: ['var(--accent-primary)', '#ff4444', 'var(--accent-primary)']
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}
                >
                  ❌ Error: {importResult.error}
                </motion.p>
              ) : (
                <div>
                  <motion.p
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  >
                    ✅ Success!
                  </motion.p>
                  <motion.p
                    whileHover={{ scale: 1.05, x: 5 }}
                    style={{ margin: '0.5rem 0', cursor: 'default' }}
                  >
                    📦 Categories: {importResult.categoriesAdded}
                  </motion.p>
                  <motion.p
                    whileHover={{ scale: 1.05, x: 5 }}
                    style={{ margin: '0.5rem 0', cursor: 'default' }}
                  >
                    🎁 Items: {importResult.itemsAdded}
                  </motion.p>
                  {importResult.errors.length > 0 && (
                    <motion.div 
                      className="errors"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{ 
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '2px solid var(--border-color)'
                      }}
                    >
                      <motion.p
                        animate={{ 
                          rotate: [0, -2, 2, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        ⚠️ Errors:
                      </motion.p>
                      {importResult.errors.map((err, i) => (
                        <motion.p 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          style={{ margin: '0.25rem 0' }}
                        >
                          {err}
                        </motion.p>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
