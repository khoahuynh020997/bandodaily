/**
 * data.js - Quản lý dữ liệu (localStorage, CRUD)
 */

import { STORAGE_KEYS, DEFAULT_DISTRICTS, DEFAULT_AGENTS, IMAGE_CONFIG } from './config.js';

/** @type {string[]} */
export let districts = [...DEFAULT_DISTRICTS];

/** @type {Array} */
export let agents = [];

export let currentDistrict = "Huyện Gò Quao";
export let activeAgentId = null;
export let activeMonthForDaily = 1;
export let isTotalTonnesVisible = false;
export let isMonthTonnesVisible = false;

// --- Districts ---
export function loadDistricts() {
    const stored = localStorage.getItem(STORAGE_KEYS.DISTRICTS);
    if (stored) {
        try {
            districts = JSON.parse(stored);
        } catch (e) {
            console.warn('Lỗi parse districts, dùng mặc định', e);
            districts = [...DEFAULT_DISTRICTS];
        }
    }
}

export function saveDistricts() {
    localStorage.setItem(STORAGE_KEYS.DISTRICTS, JSON.stringify(districts));
}

// --- Agents ---
export function loadAgents() {
    const stored = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (stored) {
        try {
            agents = JSON.parse(stored);
        } catch (e) {
            console.warn('Lỗi parse agents, dùng mặc định', e);
            agents = structuredClone(DEFAULT_AGENTS);
            saveAgents();
        }
    } else {
        agents = structuredClone(DEFAULT_AGENTS);
        saveAgents();
    }
    agents.forEach(a => {
        if (!a.dailySales) a.dailySales = {};
        if (!a.farmers) a.farmers = [];
        if (a.image === undefined) a.image = "";
    });
}

export function saveAgents() {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
}

export function saveToLocalStorage(onStatsUpdate) {
    saveAgents();
    if (typeof onStatsUpdate === 'function') onStatsUpdate();
}

// --- Helpers tính toán sản lượng ---
export function getAgentTotalTonnes(agent) {
    let total = 0;
    const dailySales = agent.dailySales || {};
    for (let m = 1; m <= 12; m++) {
        const daysObj = dailySales[m] || {};
        for (const d in daysObj) {
            total += Number(daysObj[d]) || 0;
        }
    }
    return total;
}

export function getMonthTotalTonnes(agent, month) {
    let total = 0;
    const daysObj = (agent.dailySales || {})[month] || {};
    for (const d in daysObj) {
        total += Number(daysObj[d]) || 0;
    }
    return total;
}

export function getDaysInMonth(month) {
    if (month === 2) return 28;
    if ([4, 6, 9, 11].includes(month)) return 30;
    return 31;
}

export function formatTon(amount) {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(amount);
}

// --- CRUD Agents ---
export function findAgent(id) {
    return agents.find(a => a.id === id);
}

export function addAgent(data) {
    const newAgent = {
        id: Date.now().toString(),
        targetSales: 50,
        dailySales: {},
        image: "",
        farmers: [],
        createdAt: new Date().toISOString(),
        ...data
    };
    agents.unshift(newAgent);
    return newAgent;
}

export function updateAgent(id, data) {
    const index = agents.findIndex(a => a.id === id);
    if (index === -1) return null;
    agents[index] = { ...agents[index], ...data };
    return agents[index];
}

export function deleteAgent(id) {
    agents = agents.filter(a => a.id !== id);
}

// --- CRUD Farmers ---
export function addFarmer(agentId, farmerData) {
    const agent = findAgent(agentId);
    if (!agent) return null;
    if (!agent.farmers) agent.farmers = [];
    const farmer = {
        id: Date.now().toString(),
        ...farmerData
    };
    agent.farmers.unshift(farmer);
    return farmer;
}

export function updateFarmer(agentId, farmerId, data) {
    const agent = findAgent(agentId);
    if (!agent || !agent.farmers) return null;
    const idx = agent.farmers.findIndex(f => f.id === farmerId);
    if (idx === -1) return null;
    agent.farmers[idx] = { ...agent.farmers[idx], ...data };
    return agent.farmers[idx];
}

export function deleteFarmer(agentId, farmerId) {
    const agent = findAgent(agentId);
    if (!agent || !agent.farmers) return;
    agent.farmers = agent.farmers.filter(f => f.id !== farmerId);
}

// --- Districts CRUD ---
export function addDistrict(name) {
    if (districts.includes(name)) return false;
    districts.push(name);
    currentDistrict = name;
    return true;
}

export function renameDistrict(oldName, newName) {
    const idx = districts.indexOf(oldName);
    if (idx === -1) return false;
    districts[idx] = newName;
    agents.forEach(a => {
        if (a.district === oldName) a.district = newName;
    });
    if (currentDistrict === oldName) currentDistrict = newName;
    return true;
}

export function canDeleteDistrict(name) {
    const count = agents.filter(a => a.district === name).length;
    if (count > 0) return { success: false, count };
    return { success: true };
}

export function removeDistrict(name) {
    districts = districts.filter(d => d !== name);
    if (currentDistrict === name && districts.length > 0) {
        currentDistrict = districts[0];
    }
}

// --- Image processing ---
export function processImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { WIDTH, HEIGHT, QUALITY, ASPECT } = IMAGE_CONFIG;

                let srcWidth = img.width;
                let srcHeight = img.height;
                let renderWidth, renderHeight, offsetX = 0, offsetY = 0;

                if (srcWidth / srcHeight > ASPECT) {
                    renderHeight = srcHeight;
                    renderWidth = srcHeight * ASPECT;
                    offsetX = (srcWidth - renderWidth) / 2;
                } else {
                    renderWidth = srcWidth;
                    renderHeight = srcWidth / ASPECT;
                    offsetY = (srcHeight - renderHeight) / 2;
                }

                canvas.width = WIDTH;
                canvas.height = HEIGHT;
                ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight, 0, 0, WIDTH, HEIGHT);
                resolve(canvas.toDataURL('image/jpeg', QUALITY));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}