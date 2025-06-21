import React from 'react';
import './Footer.css';
import { Github, Facebook, Mail, ExternalLink, Heart, Code, BookOpen, Zap } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'JLPT Levels', path: '/jlpt' },
    { name: 'Hiragana', path: '/hiragana' },
    { name: 'Katakana', path: '/katakana' },
    { name: 'Learning Games', path: '/game' }
  ];

  const projectLinks = [
    { name: 'View Source Code', url: 'https://github.com/dodoododo/PBL3-Japanese-Dictionary', icon: Github, external: true },
    { name: 'Hau (Contributor)', url: 'https://github.com/dodoododo', icon: Github, external: true },
    { name: 'Ngoc (Contributor)', url: 'https://github.com/sangoonthego', icon: Github, external: true },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/dodoododo', icon: Github, className: 'social-github' },
    { name: 'Facebook', url: 'https://www.facebook.com/narwhal333/', icon: Facebook, className: 'social-facebook' },
    { name: 'Email', url: 'mailto:1stjarbrofist.com@gmail.com', icon: Mail, className: 'social-mail' }
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-grid">

          <div className="brand-section">
            <div className="brand-header">
              <BookOpen className="brand-icon" />
              <h3 className="brand-title">JapanEasy</h3>
            </div>
            <p className="brand-text">
              Made with <Heart className="heart-icon" /> for Japanese learners worldwide
            </p>
            <div className="creator-info">
              <p>Created by</p>
              <p className="creator-name">Hau & Ngoc</p>
            </div>
          </div>

          <div className="links-section">
            <h4 className="links-title">Quick Links</h4>
            <ul className="links-list">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="link-item">
                    <Zap className="link-icon" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="links-section">
            <h4 className="links-title project-title">Project</h4>
            <ul className="links-list">
              {projectLinks.map((link, idx) => {
                const IconComp = link.icon;
                return (
                  <li key={idx}>
                    <a href={link.url} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className="link-item">
                      <IconComp className="link-icon" />
                      {link.name}
                      {link.external && <ExternalLink className="external-icon" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="links-section">
            <h4 className="links-title connect-title">Connect</h4>
            <div className="social-list">
              {socialLinks.map((social, idx) => {
                const IconComp = social.icon;
                return (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className={`social-item ${social.className}`} title={social.name}>
                    <IconComp />
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <p className="copyright">© 2025 JapanEasy - Japanese Dictionary. All rights reserved.</p>
          <div className="built-info">
            <span>Built with React & CSS</span>
            <span>•</span>
            <span>Powered by JMDict API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;