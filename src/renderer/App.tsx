import { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

export default function App() {
  return (
    <>
      <div className="main">
        <div className="text">alkjfklakdfalkfl</div>
        <motion.div
          className="background"
          key={undefined}
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="overlay" />
    </>
  );
}
