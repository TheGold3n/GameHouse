import { useState } from 'react';
import { Gamepad2, ShieldAlert } from 'lucide-react';
import { LegalModal } from './LegalModal';

export function Footer() {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-brand"><Gamepad2 size={15} /> GAMEHOUSE</div>
        <span>Player operations console</span>
        <button onClick={() => setShowLegal(true)} className="flex items-center text-xs hover:text-white text-gray-400 mx-4">
          <ShieldAlert size={12} className="mr-1" /> Aviso Legal & Privacidad
        </button>
        <span className="footer-version">v1.0.0 · Mock environment</span>
      </footer>
      <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
    </>
  );
}
