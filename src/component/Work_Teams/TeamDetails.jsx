import React, { useEffect, useState } from 'react';
import { fetchTeamById } from './api/work_teams_api';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import { User, Briefcase } from 'lucide-react';

export default function TeamDetails({ teamId }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTeamById(teamId);
        if (!mounted) return;
        setTeam(data);
      } catch (err) {
        console.error('Failed to load team:', err);
        if (mounted) setError(String(err.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (teamId) load();
    return () => { mounted = false; };
  }, [teamId]);

  const memberAvatar = (member) => {
    // member.data is base64 without data: prefix in your sample; member.contentType provided.
    if (!member) return null;
    if (member.data) {
      const contentType = member.contentType || 'image/jpeg';
      // if data already includes data: prefix, use as-is
      if (String(member.data).startsWith('data:')) return member.data;
      return `data:${contentType};base64,${member.data}`;
    }
    // fallback placeholder
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=ddd&color=444`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200" dir={dir} lang={lang}>
        <div className="text-sm text-slate-600">Loading team...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200 text-red-600" dir={dir} lang={lang}>
        Error: {error}
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 p-4" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            {team.name}
          </h4>
          <div className="text-sm text-slate-500">Manager: {team.managerName || '—'}</div>
        </div>
        <div className="text-sm text-slate-600">{team.numberOfEmployees ?? (team.teamMembers.length)}</div>
      </div>

      <div className="divide-y divide-slate-100">
        {team.teamMembers.length === 0 ? (
          <div className="text-sm text-slate-500 py-4">No members</div>
        ) : (
          team.teamMembers.map((m) => (
            <div key={m.id} className="py-3 flex items-center gap-3">
              <img src={memberAvatar(m)} alt={m.name} className="w-12 h-12 rounded-full object-cover border" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{m.name}</div>
                <div className="text-xs text-slate-500 truncate">{m.jobTitle || m.jobTitleName || ''}</div>
                <div className="text-xs text-slate-400 truncate">{m.department || ''}</div>
              </div>
              <div className="text-xs text-slate-500">{m.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
