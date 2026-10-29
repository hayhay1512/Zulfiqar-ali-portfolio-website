import { useState } from 'react';
import { SUPABASE_SQL_SCRIPT } from '../lib/sqlScript';
import { OWNER_EMAIL, SUPABASE_URL } from '../lib/supabase';
import { Copy, Check, Download, X, ExternalLink, Terminal, Shield, UserPlus, Lock } from 'lucide-react';

interface SqlSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SqlSetupModal({ isOpen, onClose }: SqlSetupModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase_schema_zulfiqar_portfolio.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                Supabase Backend Setup
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Database, Auth & Storage Setup
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-stone-800 dark:text-stone-200 text-sm">
          {/* Instructions Step by Step */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Quick Step-by-Step Setup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span>Step 1: Run SQL Script</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Open your{' '}
                  <a
                    href="https://supabase.com/dashboard/project/qqvmcorazhiujurrxugl/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-0.5"
                  >
                    Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                  </a>
                  . Paste the script below and click <strong>Run</strong>. Then in Supabase, go to <strong>Storage &gt; New Bucket</strong>, name it <code className="px-1 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[11px]">portfolio-assets</code> and toggle <strong>Public bucket: ON</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <UserPlus className="w-4 h-4" />
                  <span>Step 2: Create Owner Account</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Go to <strong>Authentication &gt; Users</strong> in Supabase. Click <strong>Add user &gt; Create user</strong>. Enter email: <code className="px-1 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[11px]">{OWNER_EMAIL}</code> and set a strong password. Toggle "Auto Confirm User".
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Step 3: Turn Off Public Sign-ups</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  In Supabase, go to <strong>Authentication &gt; Providers &gt; Email</strong>. Uncheck <strong>"Enable email signups"</strong> (or disable signups in Auth Settings). This prevents anyone else from signing up!
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Step 4: Log in to Admin Area</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Click <strong>Owner Login</strong> in the top navbar and log in with your credentials. You can now edit bio, upload avatars, add projects, website links, and certificates.
                </p>
              </div>
            </div>
          </div>

          {/* SQL Code Box with Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-500">
                supabase_schema_zulfiqar_portfolio.sql
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-stone-950 text-stone-300 font-mono text-xs overflow-x-auto max-h-80 border border-stone-800 leading-relaxed selection:bg-amber-500/30">
              {SUPABASE_SQL_SCRIPT}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
