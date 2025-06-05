import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { JLPT_DATA } from '../../data';
import './Admin.css';

interface KanjiItem {
  kanji: string;
  reading: string;
  meaning: string;
}

interface Props {
  level: string;
  onShowToast: (message: string) => void;
}

const KanjiManagement: React.FC<Props> = ({ level, onShowToast }) => {
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newKanji, setNewKanji] = useState<KanjiItem>({ kanji: '', reading: '', meaning: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<KanjiItem>({ kanji: '', reading: '', meaning: '' });

  // Load kanji data
  useEffect(() => {
    const savedData = localStorage.getItem(`kanji_${level}`);
    if (savedData) {
      setKanjiList(JSON.parse(savedData));
    } else {
      setKanjiList(JLPT_DATA[level as keyof typeof JLPT_DATA] || []);
    }
  }, [level]);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(`kanji_${level}`, JSON.stringify(kanjiList));
  }, [kanjiList, level]);

  // Handle adding new kanji
  const handleAddKanji = () => {
    if (!newKanji.kanji || !newKanji.reading || !newKanji.meaning) {
      onShowToast('Please fill all fields');
      return;
    }

    setKanjiList([...kanjiList, newKanji]);
    setNewKanji({ kanji: '', reading: '', meaning: '' });
    setShowAddForm(false);
    onShowToast('✓ Kanji added successfully');
  };

  // Handle editing kanji
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditItem({ ...kanjiList[index] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    
    if (!editItem.kanji || !editItem.reading || !editItem.meaning) {
      onShowToast('Please fill all fields');
      return;
    }

    const updatedList = [...kanjiList];
    updatedList[editingIndex] = editItem;
    setKanjiList(updatedList);
    setEditingIndex(null);
    onShowToast('✓ Kanji updated successfully');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // Handle deleting kanji
  const handleDeleteKanji = (index: number) => {
    const updatedList = kanjiList.filter((_, i) => i !== index);
    setKanjiList(updatedList);
    onShowToast('✓ Kanji deleted successfully');
  };

  // Filter kanji based on search term
  const filteredKanji = kanjiList.filter(
    (item) =>
      item.kanji.includes(searchTerm) ||
      item.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-kanji-container">
      <div className="admin-kanji-header">
        <h2 className="admin-kanji-title">Kanji Management - {level}</h2>
        <div className="admin-kanji-controls">
          <div className="admin-search-container">
            <input
              type="text"
              placeholder="Search kanji, words"
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
            <span>{showAddForm ? 'Cancel' : 'Add Kanji'}</span>
          </button>
        </div>
      </div>

      {/* Add Kanji Form */}
      {showAddForm && (
        <div className="admin-add-form admin-animate-fadeIn">
          <h3 className="admin-add-form-title">Add New Kanji</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label className="admin-form-label">Kanji</label>
              <input
                type="text"
                className="admin-form-input"
                value={newKanji.kanji}
                onChange={(e) => setNewKanji({ ...newKanji, kanji: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Reading</label>
              <input
                type="text"
                className="admin-form-input"
                value={newKanji.reading}
                onChange={(e) => setNewKanji({ ...newKanji, reading: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Meaning</label>
              <input
                type="text"
                className="admin-form-input"
                value={newKanji.meaning}
                onChange={(e) => setNewKanji({ ...newKanji, meaning: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-save-button"
              onClick={handleAddKanji}
            >
              <Save className="admin-save-icon" />
              <span>Save Kanji</span>
            </button>
          </div>
        </div>
      )}

      {/* Kanji List */}
      <div className="admin-kanji-table-container">
        <table className="admin-kanji-table">
          <thead>
            <tr className="admin-table-header">
              <th className="admin-table-header-cell">Kanji</th>
              <th className="admin-table-header-cell">Reading</th>
              <th className="admin-table-header-cell">Meaning</th>
              <th className="admin-table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKanji.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-empty-message">
                  {searchTerm ? 'No kanji found matching your search' : 'No kanji in this level yet'}
                </td>
              </tr>
            ) : (
              filteredKanji.map((item, index) => (
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
                          value={editItem.kanji}
                          onChange={(e) => setEditItem({ ...editItem, kanji: e.target.value })}
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
                        <span className="admin-kanji-display">{item.kanji}</span>
                      </td>
                      <td className="admin-table-cell">{item.reading}</td>
                      <td className="admin-table-cell">{item.meaning}</td>
                      <td className="admin-table-actions">
                        <button
                          className="admin-action-button edit"
                          onClick={() => startEditing(index)}
                        >
                          <Edit2 className="admin-action-icon" />
                        </button>
                        <button
                          className="admin-action-button delete"
                          onClick={() => handleDeleteKanji(index)}
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

export default KanjiManagement;