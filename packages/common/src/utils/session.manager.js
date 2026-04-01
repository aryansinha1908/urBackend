const redis = require('../config/redis');

const REFRESH_TOKEN_TTL_SECONDS = Number(process.env.PUBLIC_AUTH_REFRESH_TOKEN_TTL_SECONDS || 7 * 24 * 60 * 60);
const REFRESH_SESSION_PREFIX = 'project';

const toProjectIdString = (projectId) => projectId?.toString?.() || String(projectId);

const getRefreshSessionKey = (tokenId) => `${REFRESH_SESSION_PREFIX}:auth:refresh:session:${tokenId}`;

const getUserSessionsKey = (projectId, userId) => `${REFRESH_SESSION_PREFIX}:${toProjectIdString(projectId)}:user:${String(userId)}:sessions`;

const getRefreshSession = async (tokenId) => {
    const raw = await redis.get(getRefreshSessionKey(tokenId));
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const persistRefreshSession = async (session) => {
    const ttl = Math.max(1, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
    await redis.set(getRefreshSessionKey(session.tokenId), JSON.stringify(session), 'EX', ttl);
};

const getUserActiveSessions = async (projectId, userId, currentTokenId = null) => {
    const userSessionsKey = getUserSessionsKey(projectId, userId);
    const tokenIds = await redis.smembers(userSessionsKey);
    const activeSessions = [];
    const now = Date.now();

    for (const tokenId of tokenIds) {
        const session = await getRefreshSession(tokenId);
        
        // If the session itself disappeared from Redis completely, clean up the set
        if (!session) {
            await redis.srem(userSessionsKey, tokenId);
            continue;
        }

        const isExpired = new Date(session.expiresAt).getTime() <= now;
        
        // If it's expired, used (rotated), or revoked, clean it out of the active set
        if (session.revokedAt || session.isUsed || isExpired) {
            await redis.srem(userSessionsKey, tokenId);
            continue;
        }

        activeSessions.push({
            tokenId: session.tokenId,
            ip: session.ip || 'unknown',
            userAgent: session.userAgent || 'unknown',
            createdAt: session.createdAt,
            lastUsedAt: session.lastUsedAt,
            isCurrent: currentTokenId === session.tokenId
        });
    }

    // Sort showing newest activity first
    return activeSessions.sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime());
};

const revokeSessionChain = async (startTokenId) => {
    let currentTokenId = startTokenId;
    const visited = new Set();

    while (currentTokenId && !visited.has(currentTokenId)) {
        visited.add(currentTokenId);
        const session = await getRefreshSession(currentTokenId);
        if (!session) break;
        
        session.revokedAt = new Date().toISOString();
        session.lastUsedAt = new Date().toISOString();
        await persistRefreshSession(session);
        
        // Explicitly remove this token from the user's active session set
        await redis.srem(getUserSessionsKey(session.projectId, session.userId), currentTokenId);
        
        currentTokenId = session.rotatedTo || null;
    }
};

module.exports = {
    REFRESH_TOKEN_TTL_SECONDS,
    getRefreshSessionKey,
    getUserSessionsKey,
    getRefreshSession,
    persistRefreshSession,
    getUserActiveSessions,
    revokeSessionChain
};
