import React from 'react';
import { AptitudeGrade } from '../../types/trainee';
import { getGradeBadgeStyle } from '../../utils/gradeStyles';

interface GradeBadgeProps {
  label: string;
  grade?: AptitudeGrade;
  size?: 'sm' | 'md' | 'lg';
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ label, grade = 'G', size = 'sm' }) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-1.5 py-0.5 text-[10px]'
      : size === 'md'
      ? 'px-2 py-1 text-xs'
      : 'px-2.5 py-1.5 text-sm';

  return (
    <span
      className={`rounded-md border font-extrabold uppercase tracking-wider inline-flex items-center justify-between gap-1 transition-colors ${getGradeBadgeStyle(
        grade
      )} ${sizeClasses}`}
    >
      <span className="text-[9px] opacity-70 uppercase">{label}</span>
      <span className="font-black">{grade}</span>
    </span>
  );
};
