import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { JLPT_DATA } from '../../data';

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
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Kanji Management - {level}</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search kanji, reading, meaning..."
              className="bg-gray-900 text-white rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Kanji'}</span>
          </button>
        </div>
      </div>

      {/* Add Kanji Form */}
      {showAddForm && (
        <div className="bg-gray-900/60 p-4 rounded-lg mb-6 animate-fadeIn">
          <h3 className="text-lg font-medium mb-3">Add New Kanji</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kanji</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newKanji.kanji}
                onChange={(e) => setNewKanji({ ...newKanji, kanji: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Reading</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newKanji.reading}
                onChange={(e) => setNewKanji({ ...newKanji, reading: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Meaning</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newKanji.meaning}
                onChange={(e) => setNewKanji({ ...newKanji, meaning: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={handleAddKanji}
            >
              <Save className="w-4 h-4" />
              <span>Save Kanji</span>
            </button>
          </div>
        </div>
      )}

      {/* Kanji List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900/70 text-left">
              <th className="p-3 rounded-tl-lg">Kanji</th>
              <th className="p-3">Reading</th>
              <th className="p-3">Meaning</th>
              <th className="p-3 rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKanji.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  {searchTerm ? 'No kanji found matching your search' : 'No kanji in this level yet'}
                </td>
              </tr>
            ) : (
              filteredKanji.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                >
                  {editingIndex === index ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editItem.kanji}
                          onChange={(e) => setEditItem({ ...editItem, kanji: e.target.value })}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editItem.reading}
                          onChange={(e) => setEditItem({ ...editItem, reading: e.target.value })}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editItem.meaning}
                          onChange={(e) => setEditItem({ ...editItem, meaning: e.target.value })}
                        />
                      </td>
                      <td className="p-3 text-right">
                        <button
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded mr-2 transition-colors"
                          onClick={saveEdit}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">
                        <span className="text-2xl font-bold">{item.kanji}</span>
                      </td>
                      <td className="p-3">{item.reading}</td>
                      <td className="p-3">{item.meaning}</td>
                      <td className="p-3 text-right">
                        <button
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded mr-2 transition-colors"
                          onClick={() => startEditing(index)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          onClick={() => handleDeleteKanji(index)}
                        >
                          <Trash2 className="w-4 h-4" />
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