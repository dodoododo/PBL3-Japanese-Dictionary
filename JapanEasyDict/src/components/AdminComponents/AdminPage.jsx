import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JLPT_DATA } from '../../data';
import { isAuthenticated, login, logout } from '../../auth';
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadKanjiList();
    }
  }, [selectedLevel, isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const loadKanjiList = () => {
    setKanjiList(JLPT_DATA[selectedLevel] || []);
  };

  const handleAddKanji = () => {
    if (!newKanji.kanji || !newKanji.reading || !newKanji.meaning) return;
    
    const updatedList = [...kanjiList, newKanji];
    setKanjiList(updatedList);
    setNewKanji({ kanji: '', reading: '', meaning: '' });
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
      meaning: editingKanji.meaning
    };
    
    setKanjiList(updatedList);
    setEditingKanji(null);
  };

  const handleDeleteKanji = (index) => {
    const updatedList = kanjiList.filter((_, i) => i !== index);
    setKanjiList(updatedList);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <h1>Đăng nhập quản trị</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Trang Quản Trị</h1>
        <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
      </div>
      
      <div className="level-selector">
        <label>Chọn cấp độ:</label>
        <select 
          value={selectedLevel} 
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          {['N5', 'N4', 'N3', 'N2', 'N1'].map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="add-kanji-form">
        <h2>Thêm Kanji Mới</h2>
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
        <table>
          <thead>
            <tr>
              <th>Kanji</th>
              <th>Cách đọc</th>
              <th>Nghĩa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {kanjiList.map((item, index) => (
              <tr key={index}>
                {editingKanji?.index === index ? (
                  <>
                    <td>
                      <input
                        value={editingKanji.kanji}
                        onChange={(e) => setEditingKanji({ ...editingKanji, kanji: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editingKanji.reading}
                        onChange={(e) => setEditingKanji({ ...editingKanji, reading: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editingKanji.meaning}
                        onChange={(e) => setEditingKanji({ ...editingKanji, meaning: e.target.value })}
                      />
                    </td>
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
    </div>
  );
};

export default AdminPage; 