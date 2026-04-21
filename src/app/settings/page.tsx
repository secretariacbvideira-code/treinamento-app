'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Save, Image, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, settings, updateSettings } = useAppStore();

  const [appName, setAppName] = useState(settings.appName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSave = () => {
    updateSettings({ appName, logoUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja excluir todos os dados? Isso não pode ser desfeito.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Configurações</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do App
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Meu Treinamento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo (URL do Google Drive)
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Cole aqui a URL da imagem do seu Google Drive
            </p>
            {logoUrl && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Salvo!' : 'Salvar Configurações'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-4">Dados do Aplicativo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Todos os dados são salvos localmente no seu navegador. nenhum dado é enviado para servidores externos.
          </p>
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Limpar Todos os Dados
          </button>
        </div>
      </main>
    </div>
  );
}