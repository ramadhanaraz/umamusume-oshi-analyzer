import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode } from '../../types/trainee';
import { OshiSlot, AnalysisResult } from '../../utils/calculator';
import { ExportModalHeader } from './export/ExportModalHeader';
import { TopFiveOshis } from '../TopFiveOshis';
import { HeroArchetype } from '../HeroArchetype';

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: OshiSlot[];
  activeCount: number;
  analysis: AnalysisResult;
  mode: TerminologyMode;
  weightMode: WeightingMode;
  filterMode: AptitudeFilterMode;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  isOpen,
  onClose,
  slots,
  activeCount,
  analysis,
  mode,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'umamusume-oshi-strategy-card.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG card:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <ExportModalHeader
          onClose={onClose}
          onDownload={handleDownload}
          isGenerating={isGenerating}
        />

        <div className="p-6 overflow-y-auto space-y-6">
          <div
            ref={cardRef}
            className="p-6 bg-[#070b14] text-slate-100 rounded-3xl border border-slate-800 space-y-6"
          >
            <HeroArchetype
              archetype={analysis.archetype}
              activeCount={activeCount}
              onFillMore={() => {}}
              isReadOnly
            />

            <TopFiveOshis
              slots={slots}
              mode={mode}
              onSelectSlot={() => {}}
              onOpenActionMenu={() => {}}
              onManageTop50={() => {}}
              isReadOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};
