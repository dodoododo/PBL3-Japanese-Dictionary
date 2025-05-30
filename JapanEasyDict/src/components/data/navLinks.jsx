import React from 'react';

const homeIcon = (
  <div className="flex justify-center mx-auto">
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" d="M6.75024 19.2502H17.2502C18.3548 19.2502 19.2502 18.3548 19.2502 17.2502V9.75025L12.0002 4.75024L4.75024 9.75025V17.2502C4.75024 18.3548 5.64568 19.2502 6.75024 19.2502Z" />
      <path stroke="currentColor" d="M9.74963 15.7493C9.74963 14.6447 10.6451 13.7493 11.7496 13.7493H12.2496C13.3542 13.7493 14.2496 14.6447 14.2496 15.7493V19.2493H9.74963V15.7493Z" />
    </svg>
  </div>
);

const gameIcon = (
  <div className="flex justify-center mx-auto fill-current transform scale-75">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M13 20.45c0-.932-.575-1.357-1.109-1.357-.332 0-.672.156-.953.438-.284.296-.389.469-.786.469-.47 0-1.152-.534-1.152-1.5s.682-1.5 1.152-1.5c.396 0 .501.173.785.468.281.283.621.438.953.438.534 0 1.109-.425 1.109-1.357v-3.549h3.55..." />
    </svg>
  </div>
);

export const navLinks = [
  {
    path: '/hiragana',
    icon: 'あ',
    title: 'Hiragana',
  },
  {
    path: '/katakana',
    icon: 'ア',
    title: 'Katakana',
  },
];
