'use client';

import { useThemeStore } from '../lib/stores/themeStore';
import { RestaurantTheme } from '../types/theme-types';

export default function ThemeSelector() {
    const { currentTheme, switchToPreset, getAvailableThemes } = useThemeStore();
    const availableThemes = getAvailableThemes();

    const handleThemeChange = (themeId: string) => {
        switchToPreset(themeId);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">Choose Your Theme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableThemes.map((theme) => (
                    <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isSelected={currentTheme.id === theme.id}
                        onSelect={() => handleThemeChange(theme.id)}
                    />
                ))}
            </div>
        </div>
    );
}

interface ThemeCardProps {
    theme: RestaurantTheme;
    isSelected: boolean;
    onSelect: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
    return (
        <div
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}

            <h4 className="font-semibold mb-3">{theme.name}</h4>

            {/* Color Preview */}
            <div className="space-y-2">
                <div className="flex space-x-2">
                    <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary Color"
                    />
                    <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary Color"
                    />
                    <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent Color"
                    />
                </div>

                {/* Sample layout preview */}
                <div
                    className="w-full h-16 rounded border p-2"
                    style={{
                        backgroundColor: theme.colors.background,
                        color: theme.colors.foreground,
                    }}
                >
                    <div
                        className="h-3 rounded mb-1"
                        style={{ backgroundColor: theme.colors.primary, width: '60%' }}
                    />
                    <div
                        className="h-2 rounded"
                        style={{ backgroundColor: theme.colors.muted, width: '80%' }}
                    />
                </div>
            </div>
        </div>
    );
}
