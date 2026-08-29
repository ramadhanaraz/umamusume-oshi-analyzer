'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Clear All Slots',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          border: 'border-amber-500/30',
          iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25',
          Icon: AlertTriangle,
        };
      case 'danger':
      default:
        return {
          border: 'border-rose-500/30',
          iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
          Icon: Trash2,
        };
    }
  };

  const { border, iconBg, btnBg, Icon } = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-[#0e1424] border ${border} rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleIn relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Titles */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${iconBg} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0 pr-4">
            <h3 className="text-base font-black text-white">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 ${btnBg}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};