import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavLinks = (props) => {
  const [show, setShow] = useState(false);

  return (
    <li className="relative group" onClick={() => setShow(!show)}>
      <NavLink
        to={props.nav.type === 'dropdown' ? '#' : props.nav.path}
        className={({ isActive }) =>
          `${props.nav.type !== 'dropdown' ? 'flex' : 'hidden'} transition-all delay-150 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-semibold text-lg tracking-wider ${
            isActive ? 'filter brightness-50 dark:brightness-100 dark:text-white' : ''
          }`
        }
      >
        <span>{props.nav.title}</span>
      </NavLink>
    </li>
  );
};

export default NavLinks;
