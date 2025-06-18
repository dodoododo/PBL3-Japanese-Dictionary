import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import './Admin.css';

type Kanji = {
  id?: number;
  kanji: string;
  onyomi?: string;
  kunyomi?: string;
  meaning: string;
  strokes: number;
  jlptLevel?: number;
};

interface Props {
  level: string;
  onShowToast: (message: string) => void;
}

const KanjiManagement: React.FC<Props> = ({ level, onShowToast }) => {
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newKanji, setNewKanji] = useState<Kanji>({
    kanji: '',
    onyomi: '',
    kunyomi: '',
    meaning: '',
    strokes: 0,
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Kanji>({
    kanji: '',
    onyomi: '',
    kunyomi: '',
    meaning: '',
    strokes: 0,
  });

  useEffect(() => {
    fetchKanjiList();
  }, [level]);

  const fetchKanjiList = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/kanji?jlpt_level=${level}`);
      const data = await response.json();
      setKanjiList(data);
    } catch (error) {
      console.error('Error fetching Kanji list:', error);
      onShowToast('Error loading kanji list');
    }
  };

  const handleAddKanji = async () => {
    if (!newKanji.kanji || !newKanji.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/kanji`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newKanji, jlptLevel: Number(level) }),
      });

      const data: Kanji = await response.json();
      setKanjiList(prev => [...prev, data]);
      setNewKanji({ kanji: '', onyomi: '', kunyomi: '', meaning: '', strokes: 0 });
      setShowAddForm(false);
      onShowToast('✓ Kanji added successfully');
    } catch (error) {
      console.error('Error adding Kanji:', error);
      onShowToast('Error adding kanji');
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditItem({ ...kanjiList[index] });
  };

  const saveEdit = async () => {
    if (editingIndex === null || !editItem.id) return;

    if (!editItem.kanji || !editItem.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/kanji/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editItem),
      });

      const updatedKanji = await response.json();
      const updatedList = [...kanjiList];
      updatedList[editingIndex] = updatedKanji;
      setKanjiList(updatedList);
      setEditingIndex(null);
      onShowToast('✓ Kanji updated successfully');
    } catch (error) {
      console.error('Error updating Kanji:', error);
      onShowToast('Error updating kanji');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const handleDeleteKanji = async (id?: number) => {
    if (!id) return;

    try {
      await fetch(`/api/kanji/${id}`, { method: 'DELETE' });
      setKanjiList(prev => prev.filter(item => item.id !== id));
      onShowToast('✓ Kanji deleted successfully');
    } catch (error) {
      console.error('Error deleting Kanji:', error);
      onShowToast('Error deleting kanji');
    }
  };

  const filteredKanji = kanjiList.filter(
    (item) =>
      item.kanji.includes(searchTerm) ||
      item.onyomi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kunyomi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // [KEEP REST OF JSX CODE UNCHANGED]
  // You don't need to modify the JSX/UI below this point unless you want to

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
              <label className="admin-form-label">Onyomi</label>
              <input
                type="text"
                className="admin-form-input"
                value={newKanji.onyomi}
                onChange={(e) => setNewKanji({ ...newKanji, onyomi: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Kunyomi</label>
              <input
                type="text"
                className="admin-form-input"
                value={newKanji.kunyomi}
                onChange={(e) => setNewKanji({ ...newKanji, kunyomi: e.target.value })}
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
            <div className="admin-form-field">
              <label className="admin-form-label">Strokes</label>
              <input
                type="number"
                className="admin-form-input"
                value={newKanji.strokes}
                onChange={(e) => setNewKanji({ ...newKanji, strokes: Number(e.target.value) })}
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

      {/* Kanji List Table */}
      <div className="admin-kanji-table-container">
        <table className="admin-kanji-table">
          <thead>
            <tr className="admin-table-header">
              <th className="admin-table-header-cell">Kanji</th>
              <th className="admin-table-header-cell">Onyomi</th>
              <th className="admin-table-header-cell">Kunyomi</th>
              <th className="admin-table-header-cell">Meaning</th>
              <th className="admin-table-header-cell">Strokes</th>
              <th className="admin-table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKanji.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-empty-message">
                  {searchTerm ? 'No kanji found matching your search' : 'No kanji in this level yet'}
                </td>
              </tr>
            ) : (
              filteredKanji.map((item, index) => (
                <tr key={item.id ?? index} className="admin-table-row">
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
                          value={editItem.onyomi || ''}
                          onChange={(e) => setEditItem({ ...editItem, onyomi: e.target.value })}
                        />
                      </td>
                      <td className="admin-table-cell">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editItem.kunyomi || ''}
                          onChange={(e) => setEditItem({ ...editItem, kunyomi: e.target.value })}
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
                          type="number"
                          className="admin-edit-input"
                          value={editItem.strokes}
                          onChange={(e) => setEditItem({ ...editItem, strokes: Number(e.target.value) })}
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
                      <td className="admin-table-cell">{item.kanji}</td>
                      <td className="admin-table-cell">{item.onyomi || '-'}</td>
                      <td className="admin-table-cell">{item.kunyomi || '-'}</td>
                      <td className="admin-table-cell">{item.meaning}</td>
                      <td className="admin-table-cell">{item.strokes}</td>
                      <td className="admin-table-actions">
                        <button
                          className="admin-action-button edit"
                          onClick={() => startEditing(index)}
                        >
                          <Edit2 className="admin-action-icon" />
                        </button>
                        <button
                          className="admin-action-button delete"
                          onClick={() => handleDeleteKanji(item.id)}
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
