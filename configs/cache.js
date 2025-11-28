import fs from 'fs/promises';
import path from 'path';

// Cache directory and file definition
const CACHE_DIR = 'cache_data';
const CACHE_FILE = path.join(CACHE_DIR, 'cache.json');

class FileCacheStore {
    constructor() {
        // Initialize cache structure and ensure directory exists
        this._ensureCacheDir().then(() => console.log(`[Cache] Using directory: ${CACHE_DIR}`));
    }

    /**
     * Normalizes the prompt to ensure similar queries match the same key.
     */
    normalizePrompt(prompt) {
        // Convert to lowercase, remove punctuation, and extra spaces.
        return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ');
    }

    // --- File Persistence Methods ---

    async _ensureCacheDir() {
        // Creates the folder if it does not exist
        await fs.mkdir(CACHE_DIR, { recursive: true });
    }

    async _loadCache() {
        try {
            // Reads the cache file. If it doesn't exist, it throws an error that we handle.
            const data = await fs.readFile(CACHE_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If the file doesn't exist or is corrupted, start with an empty cache.
            if (error.code === 'ENOENT') {
                return {};
            }
            console.error("[Cache Error] Failed to load cache:", error.message);
            return {};
        }
    }

    async _saveCache(cache) {
        try {
            const data = JSON.stringify(cache, null, 2);
            await fs.writeFile(CACHE_FILE, data, 'utf-8');
        } catch (error) {
            console.error("[Cache Error] Failed to save cache:", error.message);
        }
    }
    
    // --- Access Methods ---

    /**
     * Retrieves a value from the cache.
     * @param {string} key - The raw user prompt.
     * @returns {Promise<object | null>} The cached value or null.
     */
    async get(key) {
        const normalizedKey = this.normalizePrompt(key);
        const cache = await this._loadCache();
        const item = cache[normalizedKey];

        if (!item) {
            return null;
        }
        
        console.log(`[Cache] Hit: ${normalizedKey}`);
        return item.value;
    }

    /**
     * Stores a value in the cache.
     * @param {string} key - The raw user prompt.
     * @param {object} value - The structured function/tool response.
     */
    async set(key, value) {
        const normalizedKey = this.normalizePrompt(key);
        const cache = await this._loadCache();
        
        cache[normalizedKey] = { value }; // Storing object: { value: <response> }
        
        await this._saveCache(cache);
        console.log(`[Cache] Stored: ${normalizedKey}`);
    }
}

// Export a singleton instance for use throughout the project
const fileCache = new FileCacheStore(); 
export default fileCache;