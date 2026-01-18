// Accessible skip-to-content link for keyboard users
import React from 'react';
import styles from './skip-to-content.module.css';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={styles['skip-to-content']}
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
}
