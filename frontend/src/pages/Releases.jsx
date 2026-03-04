import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Rocket, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Releases() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = user?.email === 'yashpouranik124@gmail.com';

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/releases`);
                setReleases(res.data);
            } catch (err) {
                console.error("Failed to fetch releases", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReleases();
    }, []);

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '10px' }}>Changelog</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                        The latest updates and improvements to urBackend.
                    </p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => navigate('/admin/create-release')}
                        className="btn btn-primary"
                        style={{ gap: '8px' }}
                    >
                        <Plus size={18} /> New Release
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : releases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <Rocket size={48} color="var(--color-text-muted)" style={{ marginBottom: '20px' }} />
                    <h3>No releases yet</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>Stay tuned for our first major update!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {releases.map((release) => (
                        <div key={release._id} style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid var(--color-border)' }}>
                            <div style={{ 
                                position: 'absolute', 
                                left: '-9px', 
                                top: '0', 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                background: 'var(--color-primary)',
                                boxShadow: '0 0 10px var(--color-primary)'
                            }}></div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                <span style={{ 
                                    background: 'rgba(99, 102, 241, 0.1)', 
                                    color: 'var(--color-primary)', 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 600 
                                }}>
                                    {release.version}
                                </span>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> {new Date(release.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '15px' }}>{release.title}</h2>
                            
                            <div 
                                style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}
                                dangerouslySetInnerHTML={{ __html: release.content.replace(/\n/g, '<br>') }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(99, 102, 241, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--color-primary);
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
