
import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell, Envelope, PencilSimple, FileText, File, Shield, ArrowSquareOut, TrendUp } from 'phosphor-react';
import { useToast } from './Toast';

interface SettingsProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme }) => {
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [profileName, setProfileName] = useState('User');
    const [profileEmail, setProfileEmail] = useState('user@cointrack.app');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const toast = useToast();

    const handleExport = (format: string) => {
        toast.addToast(`Data exported as ${format} successfully!`, 'success');
    };

    const SectionHeader = ({ title }: { title: string }) => (
        <h3 className="text-[10px] font-bold text-[#4B5568] uppercase tracking-widest mb-3 px-1">{title}</h3>
    );

    const SettingRow = ({ children, noBorder }: { children: React.ReactNode; noBorder?: boolean }) => (
        <div className={`p-5 flex items-center justify-between ${noBorder ? '' : 'border-b border-white/[0.04]'}`}>
            {children}
        </div>
    );

    const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${on ? 'bg-gradient-to-r from-[#6C5CE7] to-[#A855F7]' : 'bg-[#252A3A]'}`}
        >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="text-[#8B95A7] text-sm">Manage your account and preferences</p>
            </div>

            {/* ─── Profile Section ─── */}
            <SectionHeader title="Profile" />
            <div className="glass-card overflow-hidden">
                <div className="p-6 flex items-center space-x-4 border-b border-white/[0.04]">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-purple-500/20 flex-shrink-0">
                        {profileName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        {isEditingProfile ? (
                            <div className="space-y-2">
                                <input
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#252A3A] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    placeholder="Your name"
                                />
                                <input
                                    value={profileEmail}
                                    onChange={(e) => setProfileEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#252A3A] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    placeholder="Email"
                                />
                                <button
                                    onClick={() => { setIsEditingProfile(false); toast.addToast('Profile updated!', 'success'); }}
                                    className="px-4 py-1.5 bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] text-white text-xs font-bold rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <>
                                <h4 className="font-bold text-white text-lg">{profileName}</h4>
                                <p className="text-sm text-[#8B95A7] flex items-center space-x-1">
                                    <Envelope className="w-3.5 h-3.5" />
                                    <span>{profileEmail}</span>
                                </p>
                            </>
                        )}
                    </div>
                    {!isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="p-2.5 rounded-xl bg-white/[0.04] text-[#8B95A7] hover:text-[#A78BFA] transition-colors"
                        >
                            <PencilSimple className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Appearance ─── */}
            <SectionHeader title="Appearance" />
            <div className="glass-card overflow-hidden">
                <SettingRow>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#7C3AED]/10 rounded-xl text-[#A78BFA]">
                            {isDarkMode ? <Moon weight="fill" className="w-5 h-5" /> : <Sun weight="fill" className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Dark Mode</h4>
                            <p className="text-xs text-[#4B5568]">{isDarkMode ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                    <Toggle on={isDarkMode} onToggle={toggleTheme} />
                </SettingRow>

                <SettingRow>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#00D68F]/10 rounded-xl text-[#00D68F]">
                            <Globe weight="fill" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Currency</h4>
                            <p className="text-xs text-[#4B5568]">Display currency</p>
                        </div>
                    </div>
                    <select defaultValue="USD ($)" className="bg-[#252A3A] border border-white/[0.06] rounded-xl px-3 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-[#7C3AED]/50 outline-none">
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="GBP (£)">GBP (£)</option>
                        <option value="JPY (¥)">JPY (¥)</option>
                    </select>
                </SettingRow>

                <SettingRow noBorder>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#FBBF24]/10 rounded-xl text-[#FBBF24]">
                            <Bell weight="fill" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Notifications</h4>
                            <p className="text-xs text-[#4B5568]">Budget alerts & reminders</p>
                        </div>
                    </div>
                    <Toggle on={notificationsOn} onToggle={() => setNotificationsOn(!notificationsOn)} />
                </SettingRow>
            </div>

            {/* ─── Data Export ─── */}
            <SectionHeader title="Data & Export" />
            <div className="glass-card overflow-hidden">
                <div className="p-5">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-[#3B82F6]/10 rounded-xl text-[#3B82F6]">
                            <ArrowSquareOut weight="fill" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Export Your Data</h4>
                            <p className="text-xs text-[#4B5568]">Download your transactions in various formats</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleExport('CSV')}
                            className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-[#8B95A7] hover:text-white transition-all text-sm font-medium"
                        >
                            <File className="w-5 h-5 text-[#00D68F]" />
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() => handleExport('JSON')}
                            className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-[#8B95A7] hover:text-white transition-all text-sm font-medium"
                        >
                            <FileText className="w-5 h-5 text-[#A78BFA]" />
                            <span>Export JSON</span>
                        </button>
                    </div>
                </div>
                <div className="px-5 py-3 border-t border-white/[0.04] flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#00D68F]" />
                    <p className="text-[10px] text-[#4B5568] font-medium">Your data is encrypted and never shared with third parties.</p>
                </div>
            </div>

            {/* ─── About ─── */}
            <SectionHeader title="About" />
            <div className="glass-card overflow-hidden">
                <div className="p-5 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <TrendUp weight="bold" className="text-white w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-lg">CoinTrack</h4>
                    <p className="text-[#8B95A7] text-xs mt-1">Version 2.0.0</p>
                    <p className="text-[#4B5568] text-xs mt-3 max-w-xs mx-auto">A modern, AI-ready finance tracking platform. Built with React, Express, and SQLite.</p>
                    <div className="mt-4 pt-4 border-t border-white/[0.04] flex justify-center space-x-6">
                        <a href="#" className="text-xs text-[#A78BFA] hover:text-white transition-colors font-medium">Privacy Policy</a>
                        <a href="#" className="text-xs text-[#A78BFA] hover:text-white transition-colors font-medium">Terms of Service</a>
                    </div>
                </div>
            </div>

            <div className="h-8" /> {/* Bottom spacing */}
        </div>
    );
};

export default Settings;
