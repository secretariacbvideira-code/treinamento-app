'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

const isOnlineMode = true; // Mude para false se não houver API

export default function Home() {
  const router = useRouter();
  const offlineStore = useAppStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

const checkConnection = async () => {
    if (isOnlineMode) {
      try {
        const result = await api.getSettings();
        if (result.success) {
          offlineStore.updateSettings(result.settings);
          setOnline(true);
        }
      } catch {
        setOnline(false);
      }
    }
  };

  const user = isOnlineMode ? null : offlineStore.user;
  const settings = offlineStore.settings;

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      router.push('/dashboard');
    }
  }, [router]);

  if (user && !isOnlineMode) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!isLogin && !name) {
      setError('Preencha seu nome');
      setLoading(false);
      return;
    }

    try {
      if (isOnlineMode && online) {
        // MODO ONLINE
        if (isLogin) {
          const result = await api.login(email, password);
          if (result.success) {
            sessionStorage.setItem('user', JSON.stringify(result.user));
            router.push('/dashboard');
          } else {
            // Tentar local
            const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
            const foundUser = savedUsers.find((u: any) => u.email === email && u.senha === password);
            if (foundUser) {
              sessionStorage.setItem('user', JSON.stringify(foundUser));
              router.push('/dashboard');
            } else {
              setError(result.error || 'Email ou senha inválidos');
            }
          }
        } else {
          const result = await api.register(name, email, password);
          if (result.success) {
            sessionStorage.setItem('user', JSON.stringify(result.user));
            router.push('/dashboard');
          } else {
            setError(result.error || 'Erro ao cadastrar');
          }
        }
      } else {
        // MODO OFFLINE (fallback)
        const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
        
        if (isLogin) {
          const foundUser = savedUsers.find((u: any) => u.email === email && u.senha === password);
          if (foundUser) {
            offlineStore.setUser(foundUser);
            router.push('/dashboard');
          } else {
            setError('Email ou senha inválidos');
          }
        } else {
          if (savedUsers.find((u: any) => u.email === email)) {
            setError('Email já cadastrado');
            setLoading(false);
            return;
          }
          const newUser = { id: Date.now().toString(), name, email, senha: password };
          savedUsers.push(newUser);
          localStorage.setItem('treinamento-users', JSON.stringify(savedUsers));
          offlineStore.setUser(newUser);
          router.push('/dashboard');
        }
      }
    } catch (err) {
      // Erro - usar modo offline
      const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
      
      if (isLogin) {
        const foundUser = savedUsers.find((u: any) => u.email === email && u.senha === password);
        if (foundUser) {
          sessionStorage.setItem('user', JSON.stringify(foundUser));
          router.push('/dashboard');
        } else {
          setError('Email ou senha inválidos');
        }
      } else {
        if (savedUsers.find((u: any) => u.email === email)) {
          setError('Email já cadastrado');
        } else {
          const newUser = { id: Date.now().toString(), name, email, senha: password };
          savedUsers.push(newUser);
          localStorage.setItem('treinamento-users', JSON.stringify(savedUsers));
          sessionStorage.setItem('user', JSON.stringify(newUser));
          router.push('/dashboard');
        }
      }
    }
    
    setLoading(false);
  };

  const appTitle = settings.appName || 'Treinamento';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{appTitle}</h1>
            <p className="text-gray-500 mt-1">
              {isOnlineMode && online ? (
                <span className="text-green-600 text-sm">● Online</span>
              ) : (
                <span className="text-orange-600 text-sm">● Modo Offline</span>
              )}
            </p>
            <p className="text-gray-500 mt-1">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}