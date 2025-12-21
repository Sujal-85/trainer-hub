import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    ExternalLink,
    MapPin,
    Mail,
    Phone,
    LayoutDashboard,
    LogOut,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { getTrainers, updateTrainerStatus } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        // Check auth
        if (localStorage.getItem('adminAuth') !== 'true') {
            navigate('/login/admin');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getTrainers();
            setTrainers(res.data);
        } catch (error) {
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateTrainerStatus(id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            fetchData();
            if (selectedTrainer?._id === id) {
                setSelectedTrainer({ ...selectedTrainer, status: newStatus });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const logout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/login/admin');
    };

    const filteredTrainers = trainers.filter(t =>
        filter === 'all' ? true : t.status === filter
    );

    const stats = {
        total: trainers.length,
        pending: trainers.filter(t => t.status === 'pending').length,
        approved: trainers.filter(t => t.status === 'approved').length,
        rejected: trainers.filter(t => t.status === 'rejected').length,
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass-card border-r border-border/50 hidden md:flex flex-col">
                <div className="p-6">
                    <img
                        src="/logo-trainer.png"
                        alt="Trainer Hub Logo"
                        className="h-10 drop-shadow-sm"
                    />
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${filter === 'all' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">All Applications</span>
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${filter === 'pending' ? 'bg-amber-500 text-white' : 'hover:bg-muted'}`}
                    >
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Pending</span>
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${filter === 'approved' ? 'bg-success text-white' : 'hover:bg-muted'}`}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Approved</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-20 glass-card border-b border-border/20 flex items-center justify-between px-8 z-20">
                    <h2 className="text-2xl font-bold capitalize">{filter} Applications</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search trainers..."
                                className="bg-muted/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">A</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total', value: stats.total, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
                            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
                            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 rounded-3xl flex items-center gap-4"
                            >
                                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Table/List */}
                        <div className="flex-1 space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center p-20">
                                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                </div>
                            ) : filteredTrainers.length === 0 ? (
                                <div className="glass-card p-12 rounded-3xl text-center">
                                    <span className="text-4xl mb-4 block">📭</span>
                                    <p className="text-muted-foreground">No applications found in this category</p>
                                </div>
                            ) : (
                                filteredTrainers.map((trainer, i) => (
                                    <motion.div
                                        key={trainer._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedTrainer(trainer)}
                                        className={`glass-card p-4 rounded-2xl cursor-pointer hover:border-primary/50 transition-all flex items-center gap-4 ${selectedTrainer?._id === trainer._id ? 'border-primary ring-2 ring-primary/10' : ''}`}
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                                            {trainer.profilePhotoUrl ? (
                                                <img src={trainer.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">👤</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold truncate">{trainer.fullName}</h4>
                                            <p className="text-xs text-muted-foreground truncate capitalize">{trainer.type} Trainer • {trainer.city}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trainer.status === 'approved' ? 'bg-success/20 text-success' :
                                            trainer.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                                                'bg-amber-500/20 text-amber-600'
                                            }`}>
                                            {trainer.status}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Application Detail View */}
                        <AnimatePresence mode="wait">
                            {selectedTrainer && (
                                <motion.div
                                    key={selectedTrainer._id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    className="w-full lg:w-96 glass-card rounded-3xl p-6 h-fit sticky top-8 border-primary/20 bg-primary/[0.02]"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg">Application Details</h3>
                                        <button onClick={() => setSelectedTrainer(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                                    </div>

                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-muted border-4 border-white shadow-xl mb-4">
                                            <img
                                                src={selectedTrainer.profilePhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold">{selectedTrainer.fullName}</h3>
                                        <p className="text-sm text-primary font-medium capitalize">{selectedTrainer.type} Specialist</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="truncate">{selectedTrainer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span>{selectedTrainer.whatsappNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span>{selectedTrainer.city}, {selectedTrainer.state}</span>
                                        </div>

                                        <div className="pt-4 border-t border-border/50 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Expertise & Experience</p>
                                                <p className="text-sm font-medium">
                                                    {selectedTrainer.type === 'technical'
                                                        ? selectedTrainer.trainingExperience || 'Experienced'
                                                        : selectedTrainer.experienceLevel || 'Professional'} Trainer
                                                </p>
                                            </div>

                                            {selectedTrainer.type === 'technical' ? (
                                                <>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Technical Skills</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedTrainer.technicalSkills?.map((skill: string) => (
                                                                <span key={skill} className="px-2 py-0.5 bg-primary/5 text-primary text-[11px] rounded-md font-medium border border-primary/10">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Engineering Domains</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedTrainer.domainExpertise?.map((domain: string) => (
                                                                <span key={domain} className="px-2 py-0.5 bg-muted text-muted-foreground text-[11px] rounded-md font-medium border border-border">{domain}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Training Areas</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedTrainer.trainingAreas?.map((area: string) => (
                                                            <span key={area} className="px-2 py-0.5 bg-primary/5 text-primary text-[11px] rounded-md font-medium border border-primary/10">{area}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Languages</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedTrainer.languages?.map((lang: string) => (
                                                        <span key={lang} className="px-2 py-0.5 bg-muted text-muted-foreground text-[11px] rounded-md font-medium border border-border capitalize">{lang}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Daily Fee</p>
                                                    <p className="text-sm font-bold text-foreground">₹{selectedTrainer.dailyFee || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Availability</p>
                                                    <p className="text-sm font-medium text-foreground capitalize">{selectedTrainer.availability || 'Full-time'}</p>
                                                </div>
                                            </div>

                                            {selectedTrainer.shortBio && (
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Bio</p>
                                                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">{selectedTrainer.shortBio}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {selectedTrainer.resumeUrl && (
                                                    <a
                                                        href={selectedTrainer.resumeUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-all border border-border"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        <span>RESUME</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {(selectedTrainer.demoSessionLink || selectedTrainer.demoSessionLinks) && (
                                                    <a
                                                        href={selectedTrainer.demoSessionLink || selectedTrainer.demoSessionLinks}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-all border border-border"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        <span>DEMO</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/50">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedTrainer._id, 'rejected')}
                                            disabled={selectedTrainer.status === 'rejected'}
                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedTrainer._id, 'approved')}
                                            disabled={selectedTrainer.status === 'approved'}
                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:shadow-lg transition-all"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
