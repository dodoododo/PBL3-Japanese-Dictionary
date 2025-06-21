import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import './Admin.css';

interface WordItem {
  id?: number;
  word: string;
  reading: string;
  meaning: string;
  jlpt?: string;
  is_common?: boolean;
}

interface ExampleItem {
  id?: number;
  sentenceJp: string;
  sentenceEn: string;
}

interface Props {
  level: string;
  onShowToast: (message: string) => void;
}

const WordsManagement: React.FC<Props> = ({ level, onShowToast }) => {
  const [wordsList, setWordsList] = useState<WordItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newWord, setNewWord] = useState<WordItem>({
    word: '',
    reading: '',
    meaning: '',
    is_common: false,
  });
  const [newExample, setNewExample] = useState<ExampleItem>({
    sentenceJp: '',
    sentenceEn: '',
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<WordItem>({
    word: '',
    reading: '',
    meaning: '',
    is_common: false,
  });
  const [examples, setExamples] = useState<{ [key: number]: ExampleItem[] }>({});
  const [editingExample, setEditingExample] = useState<{ wordId: number; example: ExampleItem } | null>(null);
  const [showExampleForm, setShowExampleForm] = useState<number | null>(null);

  useEffect(() => {
    fetchWordsList();
  }, [level]);

  const fetchWordsList = async () => {
    try {
      const response = await fetch(`/api/words/jlpt?jlpt_level=${level}`);
      const data = await response.json();
      setWordsList(data);
      // Fetch examples for each word
      const examplesMap: { [key: number]: ExampleItem[] } = {};
      for (const word of data) {
        if (word.id) {
          const examplesResponse = await fetch(`/api/examples/${word.id}`);
          examplesMap[word.id] = await examplesResponse.json();
        }
      }
      setExamples(examplesMap);
    } catch (error) {
      console.error('Error fetching Words list:', error);
      onShowToast('Error loading words list');
    }
  };

  const handleAddWord = async () => {
    if (!newWord.word || !newWord.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newWord, jlpt: level }),
      });

      const data: WordItem = await response.json();
      setWordsList((prev) => [...prev, data]);
      setNewWord({ word: '', reading: '', meaning: '', is_common: false });
      setShowAddForm(false);
      onShowToast('✓ Word added successfully');

      // Add example if provided
      if (newExample.sentenceJp && newExample.sentenceEn) {
        await handleAddExample(data.id!, newExample);
        setNewExample({ sentenceJp: '', sentenceEn: '' });
      }
    } catch (error) {
      console.error('Error adding Word:', error);
      onShowToast('Error adding word');
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditItem({ ...wordsList[index] });
  };

  const saveEdit = async () => {
    if (editingIndex === null || !editItem.id) return;

    if (!editItem.word || !editItem.reading || !editItem.meaning) {
      onShowToast('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/words/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editItem, jlpt: level }),
      });

      const updatedWord = await response.json();
      const updatedList = [...wordsList];
      updatedList[editingIndex] = updatedWord;
      setWordsList(updatedList);
      setEditingIndex(null);
      onShowToast('✓ Word updated successfully');
    } catch (error) {
      console.error('Error updating Word:', error);
      onShowToast('Error updating word');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const handleDeleteWord = async (id?: number) => {
    if (!id) return;

    try {
      await fetch(`/api/words/${id}`, { method: 'DELETE' });
      setWordsList((prev) => prev.filter((item) => item.id !== id));
      setExamples((prev) => {
        const newExamples = { ...prev };
        delete newExamples[id];
        return newExamples;
      });
      onShowToast('✓ Word deleted successfully');
    } catch (error) {
      console.error('Error deleting Word:', error);
      onShowToast('Error deleting word');
    }
  };

  const handleAddExample = async (wordId: number, example: ExampleItem) => {
    if (!example.sentenceJp || !example.sentenceEn) {
      onShowToast('Please provide both Japanese and English sentences');
      return;
    }

    try {
      const response = await fetch('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: { id: wordId },
          sentenceJp: example.sentenceJp,
          sentenceEn: example.sentenceEn,
        }),
      });

      const newExample = await response.json();
      setExamples((prev) => ({
        ...prev,
        [wordId]: [...(prev[wordId] || []), newExample],
      }));
      setShowExampleForm(null);
      setNewExample({ sentenceJp: '', sentenceEn: '' });
      onShowToast('✓ Example added successfully');
    } catch (error) {
      console.error('Error adding example:', error);
      onShowToast('Error adding example');
    }
  };

  const startEditingExample = (wordId: number, example: ExampleItem) => {
    setEditingExample({ wordId, example: { ...example } });
  };

  const saveEditExample = async () => {
    if (!editingExample || !editingExample.example.id) return;

    try {
      const response = await fetch(`/api/examples/${editingExample.example.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentenceJp: editingExample.example.sentenceJp,
          sentenceEn: editingExample.example.sentenceEn,
        }),
      });

      const updatedExample = await response.json();
      setExamples((prev) => ({
        ...prev,
        [editingExample.wordId]: prev[editingExample.wordId].map((ex) =>
          ex.id === updatedExample.id ? updatedExample : ex
        ),
      }));
      setEditingExample(null);
      onShowToast('✓ Example updated successfully');
    } catch (error) {
      console.error('Error updating example:', error);
      onShowToast('Error updating example');
    }
  };

  const cancelEditExample = () => {
    setEditingExample(null);
  };

  const handleDeleteExample = async (wordId: number, exampleId?: number) => {
    if (!exampleId) return;

    try {
      await fetch(`/api/examples/${exampleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setExamples((prev) => ({
        ...prev,
        [wordId]: prev[wordId].filter((ex) => ex.id !== exampleId),
      }));
      onShowToast('✓ Example deleted successfully');
    } catch (error) {
      console.error('Error deleting example:', error);
      onShowToast('Error deleting example');
    }
  };

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
              <label className="admin-form-label">Example (Japanese)</label>
              <input
                type="text"
                className="admin-form-input"
                value={newExample.sentenceJp}
                onChange={(e) => setNewExample({ ...newExample, sentenceJp: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Example (English)</label>
              <input
                type="text"
                className="admin-form-input"
                value={newExample.sentenceEn}
                onChange={(e) => setNewExample({ ...newExample, sentenceEn: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label">Is Common</label>
              <input
                type="checkbox"
                className="admin-form-checkbox"
                checked={newWord.is_common}
                onChange={(e) => setNewWord({ ...newWord, is_common: e.target.checked })}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-save-button" onClick={handleAddWord}>
              <Save className="admin-save-icon" />
              <span>Save Word</span>
            </button>
          </div>
        </div>
      )}

      <div className="admin-words-table-container">
        <table className="admin-words-table">
          <thead>
            <tr className="admin-table-header">
              <th className="admin-table-header-cell">Word</th>
              <th className="admin-table-header-cell">Reading</th>
              <th className="admin-table-header-cell">Meaning</th>
              <th className="admin-table-header-cell">Is Common</th>
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
                <React.Fragment key={item.id ?? index}>
                  <tr className="admin-table-row">
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
                            value={editItem.reading || ''}
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
                            type="checkbox"
                            className="admin-edit-checkbox"
                            checked={editItem.is_common || false}
                            onChange={(e) => setEditItem({ ...editItem, is_common: e.target.checked })}
                          />
                        </td>
                        <td className="admin-table-actions">
                          <button className="admin-action-button save" onClick={saveEdit}>
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
                        <td className="admin-table-cell">{item.word}</td>
                        <td className="admin-table-cell">{item.reading || '-'}</td>
                        <td className="admin-table-cell">{item.meaning}</td>
                        <td className="admin-table-cell">{item.is_common ? 'Yes' : 'No'}</td>
                        <td className="admin-table-actions">
                          <button
                            className="admin-action-button edit"
                            onClick={() => startEditing(index)}
                          >
                            <Edit2 className="admin-action-icon" />
                          </button>
                          <button
                            className="admin-action-button delete"
                            onClick={() => handleDeleteWord(item.id)}
                          >
                            <Trash2 className="admin-action-icon" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td colSpan={5} className="admin-table-cell">
                      <div className="admin-examples-section">
                        <h4 className="admin-examples-title">Examples</h4>
                        {examples[item.id!] && examples[item.id!].length > 0 ? (
                          <ul className="admin-examples-list">
                            {examples[item.id!].map((example) => (
                              <li key={example.id} className="admin-example-item">
                                {editingExample && editingExample.example.id === example.id ? (
                                  <div className="admin-example-edit-form">
                                    <input
                                      type="text"
                                      className="admin-form-input"
                                      value={editingExample.example.sentenceJp}
                                      onChange={(e) =>
                                        setEditingExample({
                                          ...editingExample,
                                          example: { ...editingExample.example, sentenceJp: e.target.value },
                                        })
                                      }
                                      placeholder="Japanese sentence"
                                    />
                                    <input
                                      type="text"
                                      className="admin-form-input"
                                      value={editingExample.example.sentenceEn}
                                      onChange={(e) =>
                                        setEditingExample({
                                          ...editingExample,
                                          example: { ...editingExample.example, sentenceEn: e.target.value },
                                        })
                                      }
                                      placeholder="English sentence"
                                    />
                                    <button
                                      className="admin-action-button save"
                                      onClick={saveEditExample}
                                    >
                                      <Save className="admin-action-icon" />
                                    </button>
                                    <button
                                      className="admin-action-button cancel"
                                      onClick={cancelEditExample}
                                    >
                                      <X className="admin-action-icon" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="admin-example-content">
                                    <span>{example.sentenceJp} ({example.sentenceEn})</span>
                                    <div className="admin-example-actions">
                                      <button
                                        className="admin-action-button edit"
                                        onClick={() => startEditingExample(item.id!, example)}
                                      >
                                        <Edit2 className="admin-action-icon" />
                                      </button>
                                      <button
                                        className="admin-action-button delete"
                                        onClick={() => handleDeleteExample(item.id!, example.id)}
                                      >
                                        <Trash2 className="admin-action-icon" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No examples available.</p>
                        )}
                        {showExampleForm === item.id ? (
                          <div className="admin-example-form">
                            <input
                              type="text"
                              className="admin-form-input"
                              value={newExample.sentenceJp}
                              onChange={(e) =>
                                setNewExample({ ...newExample, sentenceJp: e.target.value })
                              }
                              placeholder="Japanese sentence"
                            />
                            <input
                              type="text"
                              className="admin-form-input"
                              value={newExample.sentenceEn}
                              onChange={(e) =>
                                setNewExample({ ...newExample, sentenceEn: e.target.value })
                              }
                              placeholder="English sentence"
                            />
                            <button
                              className="admin-save-button"
                              onClick={() => handleAddExample(item.id!, newExample)}
                            >
                              <Save className="admin-save-icon" />
                              Save Example
                            </button>
                            <button
                              className="admin-action-button cancel"
                              onClick={() => setShowExampleForm(null)}
                            >
                              <X className="admin-action-icon" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="admin-add-button"
                            onClick={() => setShowExampleForm(item.id!)}
                          >
                            <Plus className="admin-add-icon" />
                            Add Example
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordsManagement;
