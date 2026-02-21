import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, ChevronRight, ArrowLeft, Key } from 'lucide-react';
import { verifyEmail } from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryEmail = new URLSearchParams(location.search).get('email') || '';

    const [email, setEmail] = useState(queryEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await verifyEmail(email, code);
            setSuccess('Email verified successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-mesh flex font-inter">
            {/* Left Side - Visual (Simplified copy from Login for consistency) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full animate-float" />
                </div>
                <div className="relative z-10 max-w-lg space-y-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight font-outfit">
                        Secure Your <span className="text-blue-500 italic">Identity.</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Verify your email address to activate your LifeLink account and start saving lives.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-[#f8fafc] dark:bg-[#05070a] transition-colors duration-300">
                <div className="absolute top-12 right-12">
                    <ThemeToggle />
                </div>

                <button onClick={() => navigate('/login')} className="absolute top-12 left-12 lg:left-20 flex items-center text-slate-500 hover:text-blue-600 font-bold transition-all group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest leading-none mt-0.5">Back to Login</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-12"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Verify Email</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter the 6-digit verification code sent to your email.</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                                <p className="text-sm text-red-600 font-semibold">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
                                <p className="text-sm text-green-600 font-semibold">{success}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Verification Code</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 shadow-sm tracking-[0.5em] text-center text-xl font-bold"
                                    placeholder="000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 group h-14"
                        >
                            <span className="font-bold text-lg">{loading ? 'Verifying...' : 'Verify Email'}</span>
                            {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
