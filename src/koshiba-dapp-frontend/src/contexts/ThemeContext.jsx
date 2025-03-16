import React, { createContext, useState, useEffect } from 'react';

// テーマコンテキストを作成
export const ThemeContext = createContext();

// テーマプロバイダーコンポーネント
export const ThemeProvider = ({ children }) => {
  // ローカルストレージからテーマを取得するか、デフォルトでライトモードを設定
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // テーマの切り替え関数
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // テーマが変更されたらローカルストレージに保存し、body要素にクラスを適用
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 