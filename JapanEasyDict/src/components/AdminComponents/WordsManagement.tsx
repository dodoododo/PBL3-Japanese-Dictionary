import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { WORDS_DATA } from '../../data';

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
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Words Management - {level}</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search words, reading, meaning..."
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
            <span>{showAddForm ? 'Cancel' : 'Add Word'}</span>
          </button>
        </div>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <div className="bg-gray-900/60 p-4 rounded-lg mb-6 animate-fadeIn">
          <h3 className="text-lg font-medium mb-3">Add New Word</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Word</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newWord.word}
                onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Reading</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newWord.reading}
                onChange={(e) => setNewWord({ ...newWord, reading: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Meaning</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newWord.meaning}
                onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Example (Optional)</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newWord.example}
                onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={handleAddWord}
            >
              <Save className="w-4 h-4" />
              <span>Save Word</span>
            </button>
          </div>
        </div>
      )}

      {/* Words List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900/70 text-left">
              <th className="p-3 rounded-tl-lg">Word</th>
              <th className="p-3">Reading</th>
              <th className="p-3">Meaning</th>
              <th className="p-3">Example</th>
              <th className="p-3 rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  {searchTerm ? 'No words found matching your search' : 'No words in this level yet'}
                </td>
              </tr>
            ) : (
              filteredWords.map((item, index) => (
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
                          value={editItem.word}
                          onChange={(e) => setEditItem({ ...editItem, word: e.target.value })}
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
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editItem.example}
                          onChange={(e) => setEditItem({ ...editItem, example: e.target.value })}
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
                        <span className="text-lg font-bold">{item.word}</span>
                      </td>
                      <td className="p-3">{item.reading}</td>
                      <td className="p-3">{item.meaning}</td>
                      <td className="p-3 text-sm text-gray-400">{item.example}</td>
                      <td className="p-3 text-right">
                        <button
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded mr-2 transition-colors"
                          onClick={() => startEditing(index)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          onClick={() => handleDeleteWord(index)}
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

export default WordsManagement;