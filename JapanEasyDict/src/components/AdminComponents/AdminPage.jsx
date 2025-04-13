import React, { useState, useEffect } from 'react';
import { JLPT_DATA } from '../../data';
import { isAuthenticated, login } from '../../auth';
import './Admin.css';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [kanjiList, setKanjiList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [editingKanji, setEditingKanji] = useState(null);
  const [newKanji, setNewKanji] = useState({ kanji: '', reading: '', meaning: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadKanjiList();
  }, [selectedLevel, isLoggedIn]);

  const loadKanjiList = () => {
    const saved = localStorage.getItem(`kanji_${selectedLevel}`);
    if (saved) {
      setKanjiList(JSON.parse(saved));
    } else {
      setKanjiList(JLPT_DATA[selectedLevel] || []);
    }
  };

  const saveKanjiList = (list) => {
    localStorage.setItem(`kanji_${selectedLevel}`, JSON.stringify(list));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleAddKanji = () => {
    if (!newKanji.kanji || !newKanji.reading || !newKanji.meaning) return;

    const updatedList = [...kanjiList, newKanji];
    setKanjiList(updatedList);
    saveKanjiList(updatedList);
    setNewKanji({ kanji: '', reading: '', meaning: '' });
    showToast('✅ Thêm Kanji thành công!');
  };

  const handleEditKanji = (index) => {
    setEditingKanji({ ...kanjiList[index], index });
  };

  const handleUpdateKanji = () => {
    if (!editingKanji) return;
    const updatedList = [...kanjiList];
    updatedList[editingKanji.index] = {
      kanji: editingKanji.kanji,
      reading: editingKanji.reading,
      meaning: editingKanji.meaning,
    };
    setKanjiList(updatedList);
    saveKanjiList(updatedList);
    setEditingKanji(null);
    showToast('✏️ Đã cập nhật Kanji!');
  };

  const handleDeleteKanji = (index) => {
    const updatedList = kanjiList.filter((_, i) => i !== index);
    setKanjiList(updatedList);
    saveKanjiList(updatedList);
    showToast('🗑️ Đã xóa Kanji!');
  };

  const filteredKanji = kanjiList.filter((item) =>
    item.kanji.includes(searchTerm) ||
    item.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý Kanji ({selectedLevel})</h1>
      </div>

      <div className="level-selector">
        <label>Cấp độ:</label>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        className="admin-search-input"
        placeholder="Tìm Kanji, đọc, nghĩa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="add-kanji-form">
        <h2>Thêm Kanji</h2>
        <input
          type="text"
          placeholder="Kanji"
          value={newKanji.kanji}
          onChange={(e) => setNewKanji({ ...newKanji, kanji: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cách đọc"
          value={newKanji.reading}
          onChange={(e) => setNewKanji({ ...newKanji, reading: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nghĩa"
          value={newKanji.meaning}
          onChange={(e) => setNewKanji({ ...newKanji, meaning: e.target.value })}
        />
        <button onClick={handleAddKanji}>Thêm</button>
      </div>

      <div className="kanji-list">
        <h2>Danh sách Kanji</h2>
        <table className="kanji-display">
          <thead>
            <tr>
              <th>Kanji</th>
              <th>Đọc</th>
              <th>Nghĩa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredKanji.map((item, index) => (
              <tr key={index}>
                {editingKanji?.index === index ? (
                  <>
                    <td><input value={editingKanji.kanji} onChange={(e) => setEditingKanji({ ...editingKanji, kanji: e.target.value })} /></td>
                    <td><input value={editingKanji.reading} onChange={(e) => setEditingKanji({ ...editingKanji, reading: e.target.value })} /></td>
                    <td><input value={editingKanji.meaning} onChange={(e) => setEditingKanji({ ...editingKanji, meaning: e.target.value })} /></td>
                    <td>
                      <button onClick={handleUpdateKanji}>Lưu</button>
                      <button onClick={() => setEditingKanji(null)}>Hủy</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.kanji}</td>
                    <td>{item.reading}</td>
                    <td>{item.meaning}</td>
                    <td>
                      <button onClick={() => handleEditKanji(index)}>Sửa</button>
                      <button onClick={() => handleDeleteKanji(index)}>Xóa</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default AdminPage;
