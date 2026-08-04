import React from 'react';
import { Partner } from '../../../types';

export interface PartnerProfileCardProps {
  partner?: Partner | null;
  partnerId?: string;
  onBack?: () => void;
}

export function PartnerProfileCard({ partner }: PartnerProfileCardProps) {
  if (!partner) return null;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
      <h2 className="text-lg font-black text-slate-900">{partner.name_fr || partner.name}</h2>
      <p className="text-xs text-slate-500">{partner.category || 'Restaurant'}</p>
    </div>
  );
}

export default PartnerProfileCard;
