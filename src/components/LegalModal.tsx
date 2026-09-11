import React from 'react';
import { X, Shield, Code, Server, User } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog">
          <X />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2 border-gray-700">
            <Shield className="mr-2 text-yellow-500" size={24} /> Aviso Legal y Privacidad
          </h2>
          
          <div className="space-y-4 text-sm mt-4">
            <section>
              <h3 className="font-bold flex items-center mb-1"><User size={16} className="mr-2 text-blue-400" /> 1. Autoría e Identificación</h3>
              <p className="text-gray-400">Titular del proyecto: <strong>Velvyn</strong> (Chile). Este proyecto es un portafolio / middleware demostrativo.</p>
            </section>
            
            <section>
              <h3 className="font-bold flex items-center mb-1"><Shield size={16} className="mr-2 text-blue-400" /> 2. Política de Datos (Privacidad)</h3>
              <p className="text-gray-400">Practicamos la minimización de datos. <strong>No</strong> utilizamos cookies invasivas de terceros. Todo el almacenamiento local o de sesión se utiliza exclusivamente para fines técnicos, funcionales y de autenticación dentro del sistema.</p>
            </section>

            <section>
              <h3 className="font-bold flex items-center mb-1"><Code size={16} className="mr-2 text-blue-400" /> 3. Propiedad Intelectual</h3>
              <p className="text-gray-400">El código fuente y diseño de este proyecto están distribuidos bajo la <strong>Licencia MIT</strong>, permitiendo uso y modificación, pero eximiendo al autor de cualquier responsabilidad ("AS IS").</p>
            </section>

            <section>
              <h3 className="font-bold flex items-center mb-1"><Server size={16} className="mr-2 text-blue-400" /> 4. Exención de Responsabilidad</h3>
              <p className="text-gray-400">No nos hacemos responsables por la disponibilidad, políticas o fallos de servicios, bases de datos o APIs de terceros enlazados, así como fallos generados al integrar este software en producción.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
