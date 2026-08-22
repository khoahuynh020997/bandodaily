/**
 * render.js - Các hàm render giao diện
 */

import {
    agents, districts, currentDistrict, activeAgentId,
    getAgentTotalTonnes, getMonthTotalTonnes, getDaysInMonth, formatTon,
    isTotalTonnesVisible, isMonthTonnesVisible
} from './data.js';

import { openLightbox } from './ui.js';

// ==================== STATS ====================
export function updateStats() {
    document.getElementById('stat-total').textContent = agents.length;

    const currentMonth = new Date().getMonth() + 1;
    document.getElementById('current-month-label').textContent = `Sản Lượng T${currentMonth}`;

    let totalProvince = 0;
    let monthProvince = 0;

    agents.forEach(a => {
        totalProvince += getAgentTotalTonnes(a);
        monthProvince += getMonthTotalTonnes(a, currentMonth);
    });

    document.getElementById('stat-total-tonnes').textContent =
        isTotalTonnesVisible ? `${formatTon(totalProvince)} Tấn` : '*****';

    document.getElementById('stat-month-tonnes').textContent =
        isMonthTonnesVisible ? `${formatTon(monthProvince)} Tấn` : '*****';
}

// ==================== AGENT LIST ====================
export function renderAgents() {
    const listContainer = document.getElementById('agent-list');
    const emptyState = document.getElementById('empty-state');
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();

    document.getElementById('selected-district-display').textContent = currentDistrict;

    let filtered = [];
    if (searchVal.length > 0) {
        filtered = agents.filter(a =>
            a.name.toLowerCase().includes(searchVal) ||
            (a.owner && a.owner.toLowerCase().includes(searchVal)) ||
            (a.phone && a.phone.includes(searchVal)) ||
            (a.address && a.address.toLowerCase().includes(searchVal)) ||
            (a.mapQuery && a.mapQuery.toLowerCase().includes(searchVal))
        );
        document.getElementById('search-mode-hint').textContent = 'Kết quả tìm kiếm toàn tỉnh';
    } else {
        filtered = agents.filter(a => a.district === currentDistrict);
        document.getElementById('search-mode-hint').textContent = 'Chạm thẻ để xem chi tiết';
    }

    const titleEl = document.getElementById('current-district-title');
const titleText = searchVal
    ? `Kết quả ("${searchVal}")`
    : currentDistrict;
titleEl.innerHTML = `
    <span>${titleText}</span>
    <span class="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full" id="current-district-count">${filtered.length} đại lý</span>
`;

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
    } else {
        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');
        filtered.forEach(agent => {
            listContainer.appendChild(createAgentCard(agent));
        });
    }
}

function createAgentCard(agent) {
    const div = document.createElement('div');
    div.className = 'bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm active-touch flex flex-col justify-between relative cursor-pointer';
    div.dataset.agentId = agent.id;

    div.onclick = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        div.dispatchEvent(new CustomEvent('agent-click', { detail: agent.id, bubbles: true }));
    };

    const mapQueryTerm = agent.mapQuery?.trim()
        ? agent.mapQuery
        : `${agent.name} ${agent.district} Kiên Giang`;

    const totalTonnes = getAgentTotalTonnes(agent);
    const target = Number(agent.targetSales) || 0;
    const realPercent = target > 0 ? Math.round((totalTonnes / target) * 100) : 0;

    div.innerHTML = `
        <div>
            <div class="flex items-start justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5">
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        <i class="fa-solid fa-location-dot text-emerald-600"></i> ${agent.district}
                    </span>
                </div>
                <div class="flex items-center gap-1">
                    <button data-action="edit" data-id="${agent.id}" class="w-7 h-7 rounded-lg text-slate-400 active-touch hover:text-emerald-600 flex items-center justify-center">
                        <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button data-action="delete" data-id="${agent.id}" class="w-7 h-7 rounded-lg text-rose-500 active-touch hover:text-rose-700 flex items-center justify-center">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>
            </div>

            <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="font-bold text-slate-800 text-base flex-1 truncate">${agent.name}</h3>
                <div class="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    <div class="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[8px] font-extrabold text-emerald-700">✓</div>
                    <span class="text-xs font-extrabold text-emerald-800">${realPercent}%</span>
                </div>
            </div>

            <div class="space-y-1 text-xs text-slate-600 mb-2.5">
                ${agent.owner ? `<p class="flex items-center gap-1.5"><i class="fa-regular fa-user text-slate-400 w-3.5"></i> ${agent.owner}</p>` : ''}
                ${agent.phone ? `<p class="flex items-center gap-1.5"><i class="fa-solid fa-phone text-emerald-600 w-3.5"></i><a href="tel:${agent.phone}" class="font-bold text-emerald-700">${agent.phone}</a></p>` : ''}
                ${agent.address ? `<p class="flex items-start gap-1.5 text-[11px] text-slate-500"><i class="fa-solid fa-location-dot text-slate-400 w-3.5 mt-0.5"></i><span>${agent.address}</span></p>` : ''}
            </div>

            <div class="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 text-xs text-emerald-800 mb-2 flex items-center justify-between">
                <span class="font-medium text-[11px]"><i class="fa-solid fa-chart-line text-emerald-600 me-1"></i> Doanh số:</span>
                <span class="font-extrabold text-emerald-700">${formatTon(totalTonnes)} Tấn</span>
            </div>

            ${agent.note ? `<div class="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-500 mb-2 flex items-start gap-1.5"><i class="fa-solid fa-circle-info text-emerald-600 mt-0.5 shrink-0 text-[10px]"></i><span class="truncate">${agent.note}</span></div>` : ''}
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
            ${agent.phone
                ? `<a href="tel:${agent.phone}" class="flex-1 bg-emerald-50 active-touch text-emerald-700 font-semibold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1"><i class="fa-solid fa-phone text-[10px]"></i> Gọi ngay</a>`
                : '<span class="text-[11px] text-slate-400 italic pl-1">Chưa có SĐT</span>'}
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryTerm)}" target="_blank"
               class="bg-slate-100 active-touch text-slate-700 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-200">
                <i class="fa-solid fa-map-location-dot text-emerald-600"></i> Bản đồ
            </a>
        </div>
    `;
    return div;
}

// ==================== DETAIL VIEW ====================
export function renderAgentDetail(agent) {
    document.getElementById('detail-header-district').textContent = agent.district;
    document.getElementById('detail-agent-name').textContent = agent.name;
    document.getElementById('detail-agent-district').textContent = agent.district;
    document.getElementById('detail-agent-owner').textContent = agent.owner || 'Chưa cập nhật';
    document.getElementById('detail-agent-phone').textContent = agent.phone || 'Chưa cập nhật';
    document.getElementById('detail-agent-address').textContent = agent.address || 'Chưa cập nhật';

    const previewImg = document.getElementById('detail-agent-preview-img');
    const placeholder = document.getElementById('detail-agent-upload-placeholder');
    if (agent.image) {
        previewImg.src = agent.image;
        previewImg.classList.remove('hidden');
        placeholder.classList.add('hidden');
        previewImg.onclick = () => openLightbox(agent.image);
    } else {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholder.classList.remove('hidden');
        previewImg.onclick = null;
    }

    const mapQueryTerm = agent.mapQuery?.trim()
        ? agent.mapQuery
        : `${agent.name} ${agent.district} Kiên Giang`;
    document.getElementById('detail-agent-map-btn').href =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryTerm)}`;

    renderSalesTab(agent);
    renderFarmersTab(agent);
}

export function renderSalesTab(agent) {
    const target = Number(agent.targetSales) || 0;
    const current = getAgentTotalTonnes(agent);
    const percent = target > 0 ? Math.min(Math.round((current / target) * 100), 999) : 0;

    document.getElementById('detail-sales-current').textContent = `${formatTon(current)} Tấn`;
    document.getElementById('detail-sales-target').textContent = `${formatTon(target)} Tấn`;
    document.getElementById('detail-sales-percent').textContent = `${percent}%`;

    const ring = document.getElementById('progress-ring');
    ring.setAttribute('stroke-dasharray', `${Math.min(percent, 100)}, 100`);

    const bar = document.getElementById('detail-sales-bar');
    bar.style.width = `${Math.min(percent, 100)}%`;

    const statusText = document.getElementById('detail-sales-status-text');
    if (percent >= 100) {
        statusText.textContent = '🎉 Xuất sắc!';
        statusText.className = 'text-[11px] font-bold text-emerald-600';
    } else if (percent >= 50) {
        statusText.textContent = 'Khá tốt';
        statusText.className = 'text-[11px] font-semibold text-blue-600';
    } else {
        statusText.textContent = 'Cần tăng tốc';
        statusText.className = 'text-[11px] font-semibold text-amber-600';
    }

    const monthlyContainer = document.getElementById('monthly-sales-grid');
    monthlyContainer.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
        const val = getMonthTotalTonnes(agent, m);
        const item = document.createElement('button');
        item.dataset.month = m;
        item.className = `p-2.5 rounded-xl border text-left flex flex-col justify-between active-touch transition ${
            val > 0 ? 'bg-emerald-50/90 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
        }`;
        item.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Tháng ${m}</span>
                <i class="fa-solid fa-chevron-right text-[9px] text-slate-300"></i>
            </div>
            <span class="text-xs font-extrabold ${val > 0 ? 'text-emerald-800' : 'text-slate-400'} mt-1">${formatTon(val)} tấn</span>
        `;
        monthlyContainer.appendChild(item);
    }
}

export function renderDaysGrid(agent, month) {
    const container = document.getElementById('days-grid-container');
    container.innerHTML = '';

    if (!agent.dailySales) agent.dailySales = {};
    if (!agent.dailySales[month]) agent.dailySales[month] = {};

    const daysCount = getDaysInMonth(month);
    let monthTotal = 0;

    for (let d = 1; d <= daysCount; d++) {
        const dayVal = agent.dailySales[month][d] !== undefined ? agent.dailySales[month][d] : '';
        monthTotal += Number(dayVal) || 0;

        const dayCard = document.createElement('div');
        dayCard.className = 'bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between';
        dayCard.innerHTML = `
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Ngày ${d}</label>
            <div class="relative">
                <input type="number" min="0" step="0.01" value="${dayVal}"
                       data-month="${month}" data-day="${d}"
                       placeholder="0"
                       class="day-sales-input w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-1.5 pr-8 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold">
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">tấn</span>
            </div>
        `;
        container.appendChild(dayCard);
    }

    document.getElementById('daily-month-total').textContent = `${formatTon(monthTotal)} Tấn`;
}

export function renderFarmersTab(agent) {
    const farmers = agent.farmers || [];
    const container = document.getElementById('farmer-list-container');
    const emptyState = document.getElementById('farmer-empty-state');

    document.getElementById('farmer-count-stat').textContent = `${farmers.length} người`;
    container.innerHTML = '';

    if (farmers.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    farmers.forEach((farmer, idx) => {
        const stt = idx + 1;
        const farmerMapQuery = farmer.mapQuery?.trim()
            ? farmer.mapQuery
            : `${farmer.name} ${agent.district} Kiên Giang`;

        let zaloLink = farmer.zalo || '';
        if (zaloLink && !zaloLink.startsWith('http')) {
            zaloLink = `https://zalo.me/${zaloLink.replace(/[^0-9]/g, '')}`;
        }

        const card = document.createElement('div');
        card.className = 'bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 relative items-start';

        card.innerHTML = `
            <div class="w-20 aspect-3-4 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center cursor-pointer active-touch farmer-img"
                 data-img="${farmer.image || ''}">
                ${farmer.image
                    ? `<img src="${farmer.image}" class="w-full h-full object-cover">`
                    : `<i class="fa-solid fa-user text-slate-300 text-lg"></i>`}
            </div>

            <div class="flex-1 w-full space-y-2">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center justify-center shrink-0">#${stt}</span>
                        <h4 class="font-bold text-slate-800 text-sm">${farmer.name}</h4>
                    </div>
                    <div class="flex items-center gap-1">
                        <button data-action="edit-farmer" data-id="${farmer.id}" class="w-7 h-7 rounded-lg bg-slate-100 active-touch text-slate-600 flex items-center justify-center">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button data-action="delete-farmer" data-id="${farmer.id}" class="w-7 h-7 rounded-lg bg-rose-50 active-touch text-rose-600 flex items-center justify-center">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-1 text-xs text-slate-600 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    ${farmer.phone
                        ? `<p class="flex items-center gap-1"><i class="fa-solid fa-phone text-emerald-600 text-[10px] w-3"></i><a href="tel:${farmer.phone}" class="font-semibold text-emerald-700">${farmer.phone}</a></p>`
                        : '<p class="text-slate-400 italic">Chưa có SĐT</p>'}
                    ${farmer.area ? `<p class="flex items-center gap-1"><i class="fa-solid fa-vector-square text-amber-600 text-[10px] w-3"></i><span>Diện tích: <strong>${farmer.area}</strong></span></p>` : ''}
                    ${farmer.products ? `<p class="flex items-start gap-1 text-slate-500"><i class="fa-solid fa-bag-shopping text-slate-400 text-[10px] w-3 mt-0.5"></i><span>Ghi chú: ${farmer.products}</span></p>` : ''}
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span class="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                        <i class="fa-solid fa-location-crosshairs text-emerald-600"></i>
                        ${farmer.mapQuery || 'Định vị tự động'}
                    </span>
                    <div class="flex items-center gap-1.5">
                        ${zaloLink ? `
                            <a href="${zaloLink}" target="_blank" title="Mở Zalo"
                               class="bg-blue-500 active-touch text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                                <i class="fa-solid fa-comment"></i> Zalo
                            </a>` : ''}
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(farmerMapQuery)}" target="_blank"
                           class="bg-emerald-50 active-touch text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1">
                            <i class="fa-solid fa-map-location-dot"></i> Bản đồ
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==================== DISTRICTS ====================
export function renderDistrictGrid(filterKeyword = '') {
    const container = document.getElementById('district-grid-container');
    container.innerHTML = '';
    const keyword = filterKeyword.toLowerCase().trim();
    const filtered = districts.filter(d => d.toLowerCase().includes(keyword));

    if (filtered.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-4 text-slate-400 text-xs">Không tìm thấy huyện phù hợp</p>`;
        return;
    }

    filtered.forEach(dist => {
        const count = agents.filter(a => a.district === dist).length;
        const isSelected = dist === currentDistrict;
        const card = document.createElement('div');
        card.className = `p-3 rounded-2xl border flex items-center justify-between transition-all ${
            isSelected
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700'
        }`;

        card.innerHTML = `
            <div class="flex items-center gap-2 flex-1 cursor-pointer" data-action="select-district" data-name="${dist}">
                <i class="fa-solid fa-location-dot ${isSelected ? 'text-emerald-600' : 'text-slate-400'} text-xs"></i>
                <span class="font-bold text-xs truncate max-w-[140px]">${dist}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}">${count} đ/lý</span>
                <button data-action="edit-district" data-name="${dist}" class="w-6 h-6 rounded-lg bg-slate-200 active-touch text-slate-600 flex items-center justify-center text-[10px]" title="Sửa tên">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete-district" data-name="${dist}" class="w-6 h-6 rounded-lg bg-rose-100 active-touch text-rose-600 flex items-center justify-center text-[10px]" title="Xóa">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

export function populateDistrictDropdown() {
    const select = document.getElementById('form-district');
    select.innerHTML = '';
    districts.forEach(dist => {
        const opt = document.createElement('option');
        opt.value = dist;
        opt.textContent = dist;
        select.appendChild(opt);
    });
}

// ==================== RANKING ====================
export function renderRankingList() {
    const container = document.getElementById('ranking-list-container');
    container.innerHTML = '';

    const sorted = [...agents]
        .map(a => ({ ...a, totalTonnes: getAgentTotalTonnes(a) }))
        .sort((a, b) => b.totalTonnes - a.totalTonnes);

    if (sorted.length === 0) {
        container.innerHTML = `<p class="text-center py-6 text-slate-400 text-xs">Chưa có dữ liệu đại lý</p>`;
        return;
    }

    sorted.forEach((agent, index) => {
        const rank = index + 1;
        let medalColor = 'bg-slate-100 text-slate-700 border-slate-200';
        if (rank === 1) medalColor = 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold';
        if (rank === 2) medalColor = 'bg-slate-200 text-slate-800 border-slate-300 font-bold';
        if (rank === 3) medalColor = 'bg-orange-100 text-orange-800 border-orange-300 font-bold';

        const item = document.createElement('div');
        item.className = 'bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3';
        item.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
                <span class="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 text-xs ${medalColor}">#${rank}</span>
                <div class="min-w-0">
                    <h4 class="font-bold text-slate-800 text-sm truncate">${agent.name}</h4>
                    <p class="text-[10px] text-slate-400"><i class="fa-solid fa-location-dot"></i> ${agent.district}</p>
                </div>
            </div>
            <div class="text-right shrink-0">
                <span class="text-sm font-extrabold text-emerald-700">${formatTon(agent.totalTonnes)} Tấn</span>
            </div>
        `;
        container.appendChild(item);
    });
}