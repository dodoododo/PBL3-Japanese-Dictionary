import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { WORDS_DATA } from '../../data';
import './Admin.css';

interface WordItem {
  word: string;
  reading: string;
  meaning: string;
  example: string;
}

interface Props {
  level: string;
  onShowToast: (message: string) => void;
}

const WordsManagement: React.FC<Props> = ({ level, onShowToast }) => {
  const [wordsList, setWordsList] = useState<WordItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWord, setNewWord] = useState<WordItem>({ word: '', reading: '', meaning: '', example: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<WordItem>({ word: '', reading: '', meaning: '', example: '' });

  // Load words data
  useEffect(() => {
    const savedData = localStorage.getItem(`words_${level}`);
    if (savedData) {
      setWordsList(JSON.parse(savedData));
    } else {
      setWordsList(WORDS_DATA[level as keyof typeof WORDS_DATA] || []);
    }
  }, [level]);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(`words_${level}`, JSON.stringify(wordsList));
  }, [wordsList, level]);

  // Handle adding new word
  const handleAddWord = () => {
    if (!newWord.word || !newWord.reading || !newWord.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    setWordsList([...wordsList, newWord]);
    setNewWord({ word: '', reading: '', meaning: '', example: '' });
    setShowAddForm(false);
    onShowToast('✓ Word added successfully');
  };

  // Handle editing word
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditItem({ ...wordsList[index] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    
    if (!editItem.word || !editItem.reading || !editItem.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    const updatedList = [...wordsList];
    updatedList[editingIndex] = editItem;
    setWordsList(updatedList);
    setEditingIndex(null);
    onShowToast('✓ Word updated successfully');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // Handle deleting word
  const handleDeleteWord = (index: number) => {
    const updatedList = wordsList.filter((_, i) => i !== index);
    setWordsList(updatedList);
    onShowToast('✓ Word deleted successfully');
  };

  // Filter words based on search term
  const filteredWords = wordsList.filter(
    (item) =>
      item.word.includes(searchTerm) ||
      item.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-words-container">
      <div className="admin-words-header">
        <h2 className="admin-words-title">Words Management - {level}</h2>
        <div className="admin-words-controls">
          <div className="admin-search-container">
            <input
              type="text"
              placeholder="Search words, reading, meaning..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="admin-search-icon" />
          </div>
          <button 
            className="admin-add-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="admin-add-icon" />
            <span>{showAddForm ? 'Cancel' : 'Add Word'}</span>
          </button>
        </div>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <div className="admin-add-form admin-animate-fadeIn">
          <h3 className="admin-add-form-title">Add New Word</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label className="admin-form-label">Word</label>
              <input
                type="text"
                className="admin-form-input"
                value={newWord.word}
                onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Reading</label>
              <input
                type="text"
                className="admin-form-input"
                value={newWord.reading}
                onChange={(e) => setNewWord({ ...newWord, reading: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Meaning</label>
              <input
                type="text"
                className="admin-form-input"
                value={newWord.meaning}
                onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Example (Optional)</label>
              <input
                type="text"
                className="admin-form-input"
                value={newWord.example}
                onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-save-button"
              onClick={handleAddWord}
            >
              <Save className="admin-save-icon" />
              <span>Save Word</span>
            </button>
          </div>
        </div>
      )}

      {/* Words List */}
      <div className="admin-words-table-container">
        <table className="admin-words-table">
          <thead>
            <tr className="admin-table-header">
              <th className="admin-table-header-cell">Word</th>
              <th className="admin-table-header-cell">Reading</th>
              <th className="admin-table-header-cell">Meaning</th>
              <th className="admin-table-header-cell">Example</th>
              <th className="admin-table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-empty-message">
                  {searchTerm ? 'No words found matching your search' : 'No words in this level yet'}
                </td>
              </tr>
            ) : (
              filteredWords.map((item, index) => (
                <tr 
                  key={index} 
                  className="admin-table-row"
                >
                  {editingIndex === index ? (
                    <>
                      <td className="admin-table-cell">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editItem.word}
                          onChange={(e) => setEditItem({ ...editItem, word: e.target.value })}
                        />
                      </td>
                      <td className="admin-table-cell">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editItem.reading}
                          onChange={(e) => setEditItem({ ...editItem, reading: e.target.value })}
                        />
                      </td>
                      <td className="admin-table-cell">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editItem.meaning}
                          onChange={(e) => setEditItem({ ...editItem, meaning: e.target.value })}
                        />
                      </td>
                      <td className="admin-table-cell">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editItem.example}
                          onChange={(e) => setEditItem({ ...editItem, example: e.target.value })}
                        />
                      </td>
                      <td className="admin-table-actions">
                        <button
                          className="admin-action-button save"
                          onClick={saveEdit}
                        >
                          <Save className="admin-action-icon" />
                        </button>
                        <button
                          className="admin-action-button cancel"
                          onClick={cancelEdit}
                        >
                          <X className="admin-action-icon" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="admin-table-cell">
                        <span className="admin-word-display">{item.word}</span>
                      </td>
                      <td className="admin-table-cell">{item.reading}</td>
                      <td className="admin-table-cell">{item.meaning}</td>
                      <td className="admin-table-cell admin-example-text">{item.example}</td>
                      <td className="admin-table-actions">
                        <button
                          className="admin-action-button edit"
                          onClick={() => startEditing(index)}
                        >
                          <Edit2 className="admin-action-icon" />
                        </button>
                        <button
                          className="admin-action-button delete"
                          onClick={() => handleDeleteWord(index)}
                        >
                          <Trash2 className="admin-action-icon" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordsManagement;