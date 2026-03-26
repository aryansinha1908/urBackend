import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Check, Database, Code, Terminal, Plus } from 'lucide-react';
import './style.css';

const ENDPOINTS = [
    { method: 'GET', path: '/api/users', status: '200 OK' },
    { method: 'POST', path: '/api/users', status: '201 Created' },
    { method: 'GET', path: '/api/users/:id', status: '200 OK' },
    { method: 'PUT', path: '/api/users/:id', status: '200 OK' },
    { method: 'DELETE', path: '/api/users/:id', status: '200 OK' },
];

const CLICK_STEPS = [
    { name: 'name', type: 'String', required: true },
    { name: 'email', type: 'String', required: true },
    { name: 'role', type: 'String', required: false },
];

function InteractiveLanding() {
    const timersRef = useRef([]);
    const [collectionName, setCollectionName] = useState('');
    const [fields, setFields] = useState([]);
    const [isBuildingUi, setIsBuildingUi] = useState(false);
    const [showDeploying, setShowDeploying] = useState(false);
    const [showEndpoints, setShowEndpoints] = useState(false);
    const [activeEndpoints, setActiveEndpoints] = useState([]);

    const clearAllTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    const runDemo = useCallback(() => {
        clearAllTimers();
        
        // Wrap initial state updates in setTimeout to avoid synchronous setState inside useEffect
        setTimeout(() => {
            setCollectionName('');
            setFields([]);
            setIsBuildingUi(true);
            setShowDeploying(false);
            setShowEndpoints(false);
            setActiveEndpoints([]);
        }, 0);

        timersRef.current.push(setTimeout(() => setCollectionName('users'), 600));
        timersRef.current.push(setTimeout(() => setFields([CLICK_STEPS[0]]), 1200));
        timersRef.current.push(setTimeout(() => setFields([CLICK_STEPS[0], CLICK_STEPS[1]]), 1800));
        timersRef.current.push(setTimeout(() => setFields(CLICK_STEPS), 2400));
        timersRef.current.push(setTimeout(() => setIsBuildingUi(false), 2700));

        timersRef.current.push(setTimeout(() => {
            setShowDeploying(true);
        }, 3100));

        timersRef.current.push(setTimeout(() => {
            setShowDeploying(false);
            setShowEndpoints(true);
            ENDPOINTS.forEach((_, index) => {
                const t = setTimeout(() => {
                    setActiveEndpoints(prev => [...prev, index]);
                }, index * 180);
                timersRef.current.push(t);
            });
        }, 4600));
    }, []);

    useEffect(() => {
        runDemo();
        return () => clearAllTimers();
    }, [runDemo]);

    const resetAnimation = () => {
        runDemo();
    };

    return (
        <div className="interactive-landing">
            {/* Minimal Navbar */}
            <nav className="minimal-nav">
                <div className="nav-content">
                    <Link to="/" className="logo-link">
                        <img 
                            src="https://cdn.jsdelivr.net/gh/yash-pouranik/urBackend@main/frontend/public/logo.png" 
                            alt="urBackend" 
                            className="nav-logo"
                        />
                    </Link>
                    <div className="nav-actions">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-btn">
                            Get Started
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
</nav>

            {/* Hero Section */}
            <div className="hero-container">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-text"
                >
                    <div className="hero-badge">
                        <Zap size={14} />
                        <span>Zero Config. Zero Boilerplate.</span>
                    </div>
                    <h1 className="hero-title">
                        From Clicks to <span className="gradient-text">Secure APIs</span> in Seconds
                    </h1>
                    <p className="hero-description">
                        Build collections from UI clicks just like urBackend studio, then instantly get production-ready REST APIs with auth and CRUD.
                    </p>
                </Motion.div>

                {/* Interactive Demo Window */}
                <Motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="demo-window"
                >
                    <div className="window-header">
                        <div className="window-dots">
                            <span className="dot dot-red"></span>
                            <span className="dot dot-yellow"></span>
                            <span className="dot dot-green"></span>
                        </div>
                        <div className="window-title">
                            <Terminal size={14} />
                            <span>urBackend Studio</span>
                        </div>
                        <button className="replay-btn" onClick={resetAnimation}>
                            <span>↻ Replay</span>
                        </button>
                    </div>

                    <div className="window-content">
                        {/* Left Pane: CreateCollection-style UI */}
                        <div className="pane left-pane">
                            <div className="pane-header">
                                <Database size={14} />
                                <span>Collection Builder</span>
                                <span className="pane-label">UI Mode</span>
                            </div>
                            <div className="builder-pane">
                                <div className="builder-group">
                                    <label className="builder-label">Name</label>
                                    <div className="builder-input">{collectionName || 'users'}</div>
                                </div>

                                <div className="builder-header-row">
                                    <span>NAME</span>
                                    <span>TYPE</span>
                                    <span>REQ</span>
                                </div>

                                <div className="builder-table">
                                    {fields.map((field, index) => (
                                        <Motion.div
                                            key={field.name}
                                            className="builder-row"
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.25, delay: index * 0.08 }}
                                        >
                                            <span className="builder-field-name">{field.name}</span>
                                            <span className="builder-type-chip">{field.type}</span>
                                            <span className={`builder-req ${field.required ? 'on' : 'off'}`}>
                                                {field.required ? <Check size={12} /> : '—'}
                                            </span>
                                        </Motion.div>
                                    ))}
                                </div>

                                <div className="builder-actions">
                                    <button type="button" className="builder-add-btn">
                                        <Plus size={12} />
                                        Add Column
                                    </button>
                                    {isBuildingUi && <span className="builder-live">Auto-clicking...</span>}
                                </div>
                            </div>
                        </div>

                        {/* Middle: Animated Flow */}
                        <div className="flow-middle">
                            <div className="flow-line">
                                <Motion.div
                                    className="flow-pulse"
                                    animate={{
                                        x: showDeploying ? [0, 100] : 0,
                                        opacity: showDeploying ? [1, 0] : 0.3,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: showDeploying ? 0 : Infinity,
                                        repeatDelay: 1,
                                    }}
                                />
                            </div>
                            <AnimatePresence>
                                {showDeploying && (
                                    <Motion.div
                                        className="deploying-badge"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                    >
                                        <Zap size={12} />
                                        <span>Deploying...</span>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flow-icon">
                                <Zap size={20} />
                            </div>
                        </div>

                        {/* Right Pane: Generated APIs */}
                        <div className="pane right-pane">
                            <div className="pane-header">
                                <Code size={14} />
                                <span>Generated APIs</span>
                                <span className="pane-label">endpoints</span>
                            </div>
                            <div className="endpoints-container">
                                        {showEndpoints ? (
                                    ENDPOINTS.map((endpoint, index) => (
                                        <Motion.div
                                            key={index}
                                            className={`endpoint-item ${activeEndpoints.includes(index) ? 'active' : ''}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <span className={`method-tag ${endpoint.method.toLowerCase()}`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="endpoint-path">{endpoint.path}</code>
                                            <span className="status-badge">
                                                <Check size={12} />
                                                {endpoint.status}
                                            </span>
                                        </Motion.div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <Terminal size={32} className="empty-icon" />
                                        <p>Waiting for UI actions...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Motion.div>

                {/* Trust Indicators */}
                <Motion.div
                    className="trust-indicators"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="trust-item">
                        <Check size={16} />
                        <span>JWT Auth Included</span>
                    </div>
                    <div className="trust-item">
                        <Check size={16} />
                        <span>Auto Validation</span>
                    </div>
                    <div className="trust-item">
                        <Check size={16} />
                        <span>Role-Based Access</span>
                    </div>
                    <div className="trust-item">
                        <Check size={16} />
                        <span>Open Source</span>
                    </div>
                </Motion.div>

                {/* CTA Buttons */}
                <Motion.div
                    className="cta-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                >
                    <Link to="/signup" className="cta-primary">
                        <span>Start Building Free</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/docs" className="cta-secondary">
                        View Documentation
                    </Link>
                </Motion.div>
            </div>
        </div>
    );
}

export default InteractiveLanding;
