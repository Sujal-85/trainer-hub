import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import InputFieldWithIcon from '@/components/InputFieldWithIcon';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Hardcoded credentials as requested
        if (email === 'admin@gmail.com' && password === 'admin@123') {
            setTimeout(() => {
                toast.success('Admin login successful!');
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin/dashboard');
                setIsLoading(false);
            }, 1000);
        } else {
            setTimeout(() => {
                toast.error('Invalid admin credentials');
                setIsLoading(false);
            }, 800);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-10 rounded-3xl text-center">
                    <div className="mb-6">
                        <img
                            src="/logo-trainer.png"
                            alt="Trainer Hub Logo"
                            className="h-16 mx-auto drop-shadow-sm"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
                    <p className="text-muted-foreground mb-8">Login to manage trainer applications</p>

                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        <InputFieldWithIcon
                            label="Admin Email"
                            icon={Mail}
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <InputFieldWithIcon
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                            type="submit"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-8 text-xs text-muted-foreground">
                        Unauthorized access is strictly prohibited.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
