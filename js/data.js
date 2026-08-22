/**
 * data.js - Quản lý dữ liệu (localStorage, CRUD)
 * Dùng object `state` (không export let) để đổi huyện / ẩn hiện tấn luôn cập nhật UI.
 */

import { STORAGE_KEYS, DEFAULT_DISTRICTS, DEFAULT_AGENTS, IMAGE_CONFIG } from './config.js';

export const state = {
    districts: [...DEFAULT_DISTRICTS],
    agents: [],
    currentDistrict: "Huyện Gò Quao",
    activeAgentId: null,
    activeMonthForDaily: 1,
    isTotalTonnesVisible: false,
    isMonthTonnesVisible: false
};

function cloneDefaultAgents() {
    try {
        return structuredClone(DEFAULT_AGENTS);
    } catch {
        return JSON.parse(JSON.stringify(DEFAULT_AGENTS));
    }
}

function normalizeAgents(list) {
    list.forEach((a) => {
        if (!a.dailySales) a.dailySales = {};
        if (!a.farmers) a.farmers = [];
        if (a.image === undefined) a.image = "";
        if (!a.district) a.district = state.currentDistrict;
    });
}

export function loadDistricts() {
    const stored = localStorage.getItem(STORAGE_KEYS.DISTRICTS)
        || localStorage.getItem(STORAGE_KEYS.LEGACY_DISTRICTS);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                state.districts = parsed;
                return;
            }
        } catch (e) {
            console.warn('Lỗi parse districts, dùng mặc định', e);
        }
    }
    state.districts = [...DEFAULT_DISTRICTS];
}

export function saveDistricts() {
    localStorage.setItem(STORAGE_KEYS.DISTRICTS, JSON.stringify(state.districts));
}

export function loadAgents() {
    const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
        || localStorage.getItem(STORAGE_KEYS.LEGACY_AGENTS);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                state.agents = parsed;
            } else {
                state.agents = cloneDefaultAgents();
                saveAgents();
            }
        } catch (e) {
            console.warn('Lỗi parse agents, dùng mặc định', e);
            state.agents = cloneDefaultAgents();
            saveAgents();
        }
    } else {
        state.agents = cloneDefaultAgents();
        saveAgents();
    }
    normalizeAgents(state.agents);
}

export function saveAgents() {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(state.agents));
}

export function saveToLocalStorage(onStatsUpdate) {
    saveAgents();
    if (typeof onStatsUpdate === 'function') onStatsUpdate();
}

export function getAgentTotalTonnes(agent) {
    let total = 0;
    const dailySales = agent.dailySales || {};
    for (let m = 1; m <= 12; m++) {
        const daysObj = dailySales[m] || dailySales[String(m)] || {};
        for (const d in daysObj) total += Number(daysObj[d]) || 0;
    }
    return total;
}

export function getMonthTotalTonnes(agent, month) {
    let total = 0;
    const daysObj = (agent.dailySales || {})[month] || (agent.dailySales || {})[String(month)] || {};
    for (const d in daysObj) total += Number(daysObj[d]) || 0;
    return total;
}

export function getDaysInMonth(month, year = new Date().getFullYear()) {
    return new Date(year, month, 0).getDate();
}

export function formatTon(amount) {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(amount);
}

export function findAgent(id) {
    return state.agents.find((a) => a.id === id);
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
    state.agents.unshift(newAgent);
    return newAgent;
}

export function updateAgent(id, data) {
    const index = state.agents.findIndex((a) => a.id === id);
    if (index === -1) return null;
    state.agents[index] = { ...state.agents[index], ...data };
    return state.agents[index];
}

export function deleteAgent(id) {
    state.agents = state.agents.filter((a) => a.id !== id);
}

export function addFarmer(agentId, farmerData) {
    const agent = findAgent(agentId);
    if (!agent) return null;
    if (!agent.farmers) agent.farmers = [];
    const farmer = { id: Date.now().toString(), ...farmerData };
    agent.farmers.unshift(farmer);
    return farmer;
}

export function updateFarmer(agentId, farmerId, data) {
    const agent = findAgent(agentId);
    if (!agent || !agent.farmers) return null;
    const idx = agent.farmers.findIndex((f) => f.id === farmerId);
    if (idx === -1) return null;
    agent.farmers[idx] = { ...agent.farmers[idx], ...data };
    return agent.farmers[idx];
}

export function deleteFarmer(agentId, farmerId) {
    const agent = findAgent(agentId);
    if (!agent || !agent.farmers) return;
    agent.farmers = agent.farmers.filter((f) => f.id !== farmerId);
}

export function addDistrict(name) {
    if (state.districts.includes(name)) return false;
    state.districts.push(name);
    state.currentDistrict = name;
    return true;
}

export function renameDistrict(oldName, newName) {
    const idx = state.districts.indexOf(oldName);
    if (idx === -1) return false;
    state.districts[idx] = newName;
    state.agents.forEach((a) => {
        if (a.district === oldName) a.district = newName;
    });
    if (state.currentDistrict === oldName) state.currentDistrict = newName;
    return true;
}

export function canDeleteDistrict(name) {
    const count = state.agents.filter((a) => a.district === name).length;
    if (count > 0) return { success: false, count };
    return { success: true };
}

export function removeDistrict(name) {
    state.districts = state.districts.filter((d) => d !== name);
    if (state.currentDistrict === name && state.districts.length > 0) {
        state.currentDistrict = state.districts[0];
    }
}

export function processImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const { WIDTH, HEIGHT, QUALITY, ASPECT } = IMAGE_CONFIG;
                let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
                if (img.width / img.height > ASPECT) {
                    renderHeight = img.height;
                    renderWidth = img.height * ASPECT;
                    offsetX = (img.width - renderWidth) / 2;
                } else {
                    renderWidth = img.width;
                    renderHeight = img.width / ASPECT;
                    offsetY = (img.height - renderHeight) / 2;
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
