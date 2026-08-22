/**
 * app.js - Entry point & event handlers
 */

import {
    state,
    loadDistricts, loadAgents, saveDistricts, saveToLocalStorage,
    findAgent, addAgent, updateAgent, deleteAgent,
    addFarmer, updateFarmer, deleteFarmer,
    addDistrict, renameDistrict, canDeleteDistrict, removeDistrict,
    processImageToBase64, getAgentTotalTonnes, formatTon
} from './data.js';

import {
    showToast, openModalById, closeModalById, showView,
    openDeleteModal, closeDeleteModal, openLightbox, closeLightbox, toggleZoom
} from './ui.js';

import {
    updateStats, renderAgents, renderAgentDetail, renderSalesTab,
    renderDaysGrid, renderFarmersTab, renderDistrictGrid,
    populateDistrictDropdown, renderRankingList
} from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadDistricts();
        loadAgents();
        populateDistrictDropdown();
        renderAgents();
        updateStats();
        bindGlobalEvents();
    } catch (err) {
        console.error('Khởi tạo app lỗi:', err);
        showToast('Không tải được dữ liệu, đang dùng mặc định', 'error');
    }
});

function bindGlobalEvents() {
    document.getElementById('search-input')?.addEventListener('input', handleSearchInput);
    document.getElementById('clear-search-btn')?.addEventListener('click', clearSearch);

    document.getElementById('district-search-input')?.addEventListener('input', handleDistrictSearchInput);
    document.getElementById('clear-district-search-btn')?.addEventListener('click', clearDistrictSearch);

    document.getElementById('agent-list')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'edit') editAgent(id);
            if (action === 'delete') confirmDeleteAgent(id);
        }
    });

    document.getElementById('agent-list')?.addEventListener('agent-click', (e) => {
        showDetailView(e.detail);
    });

    document.getElementById('monthly-sales-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-month]');
        if (btn) openDailyView(Number(btn.dataset.month));
    });

    document.getElementById('days-grid-container')?.addEventListener('input', (e) => {
        if (e.target.classList.contains('day-sales-input')) {
            const month = Number(e.target.dataset.month);
            const day = Number(e.target.dataset.day);
            updateDaySales(month, day, e.target.value);
        }
    });

    document.getElementById('farmer-list-container')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'edit-farmer') editFarmer(id);
            if (action === 'delete-farmer') confirmDeleteFarmer(id);
            return;
        }
        const img = e.target.closest('.farmer-img');
        if (img && img.dataset.img) openLightbox(img.dataset.img);
    });

    document.getElementById('district-grid-container')?.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el) return;
        const action = el.dataset.action;
        const name = el.dataset.name;
        if (action === 'select-district') selectDistrictFromDialog(name);
        if (action === 'edit-district') openAddDistrictModal(name);
        if (action === 'delete-district') confirmDeleteDistrict(name);
    });

    document.getElementById('lightbox-img')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleZoom(e.target);
    });
}

function showDetailView(agentId) {
    const agent = findAgent(agentId);
    if (!agent) return;
    state.activeAgentId = agentId;
    showView('detail-view');
    renderAgentDetail(agent);
    switchDetailTab('sales');
}

function showHomeView() {
    state.activeAgentId = null;
    showView('home-view');
    renderAgents();
    updateStats();
}

function openDailyView(month) {
    state.activeMonthForDaily = month;
    const agent = findAgent(state.activeAgentId);
    if (!agent) return;

    showView('daily-sales-view');
    document.getElementById('daily-view-title').textContent = `Tháng ${month} - ${agent.name}`;
    document.getElementById('daily-month-heading').textContent = `Nhập Doanh Số Tháng ${month}`;
    renderDaysGrid(agent, month);
}

function closeDailyView() {
    showView('detail-view');
    const agent = findAgent(state.activeAgentId);
    if (agent) renderSalesTab(agent);
}

function switchDetailTab(tabName) {
    const btnSales = document.getElementById('tab-btn-sales');
    const btnFarmers = document.getElementById('tab-btn-farmers');
    const contentSales = document.getElementById('tab-content-sales');
    const contentFarmers = document.getElementById('tab-content-farmers');

    if (tabName === 'sales') {
        btnSales.className = 'flex-1 py-2 text-center text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-sm active-touch';
        btnFarmers.className = 'flex-1 py-2 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 text-slate-600 active-touch';
        contentSales.classList.remove('hidden');
        contentFarmers.classList.add('hidden');
    } else {
        btnFarmers.className = 'flex-1 py-2 text-center text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-sm active-touch';
        btnSales.className = 'flex-1 py-2 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 text-slate-600 active-touch';
        contentFarmers.classList.remove('hidden');
        contentSales.classList.add('hidden');
    }
}

function toggleTotalTonnesVisibility() {
    state.isTotalTonnesVisible = !state.isTotalTonnesVisible;
    updateStats();
}

function toggleMonthTonnesVisibility() {
    state.isMonthTonnesVisible = !state.isMonthTonnesVisible;
    updateStats();
}

function handleSearchInput() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    if (input.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
        clearBtn.classList.add('flex');
    } else {
        clearBtn.classList.add('hidden');
        clearBtn.classList.remove('flex');
    }
    renderAgents();
}

function clearSearch() {
    const input = document.getElementById('search-input');
    input.value = '';
    document.getElementById('clear-search-btn').classList.add('hidden');
    input.focus();
    renderAgents();
}

function openDistrictDialog() {
    document.getElementById('district-search-input').value = '';
    document.getElementById('clear-district-search-btn').classList.add('hidden');
    renderDistrictGrid();
    openModalById('district-dialog-backdrop', 'district-dialog');
}

function closeDistrictDialog() {
    closeModalById('district-dialog-backdrop', 'district-dialog');
}

function handleDistrictSearchInput() {
    const input = document.getElementById('district-search-input');
    const clearBtn = document.getElementById('clear-district-search-btn');
    if (input.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
        clearBtn.classList.add('flex');
    } else {
        clearBtn.classList.add('hidden');
        clearBtn.classList.remove('flex');
    }
    renderDistrictGrid(input.value);
}

function clearDistrictSearch() {
    const input = document.getElementById('district-search-input');
    input.value = '';
    document.getElementById('clear-district-search-btn').classList.add('hidden');
    input.focus();
    renderDistrictGrid();
}

function selectDistrictFromDialog(dist) {
    if (!dist) return;
    state.currentDistrict = dist;
    closeDistrictDialog();
    renderAgents();
    updateStats();
    showToast(`Đã chuyển sang ${dist}`);
}

function openAddDistrictModal(oldName = null) {
    document.getElementById('district-name-input').value = oldName || '';
    document.getElementById('district-old-name').value = oldName || '';
    document.getElementById('district-modal-title').textContent = oldName ? 'Sửa Tên Huyện' : 'Thêm Huyện Mới';
    openModalById('district-form-backdrop', 'district-form-modal');
}

function closeAddDistrictModal() {
    closeModalById('district-form-backdrop', 'district-form-modal');
}

function saveDistrict(e) {
    e.preventDefault();
    const oldName = document.getElementById('district-old-name').value;
    const newName = document.getElementById('district-name-input').value.trim();
    if (!newName) return;

    if (oldName) {
        renameDistrict(oldName, newName);
        saveDistricts();
        saveToLocalStorage(updateStats);
        showToast('Đã đổi tên huyện!');
    } else {
        if (!addDistrict(newName)) {
            alert('Huyện này đã tồn tại!');
            return;
        }
        saveDistricts();
        showToast('Đã thêm huyện mới!');
    }
    populateDistrictDropdown();
    renderDistrictGrid(document.getElementById('district-search-input').value);
    renderAgents();
    closeAddDistrictModal();
}

function confirmDeleteDistrict(distName) {
    const result = canDeleteDistrict(distName);
    if (!result.success) {
        alert(`Không thể xóa huyện "${distName}" vì đang chứa ${result.count} đại lý! Hãy xóa hoặc chuyển đại lý sang huyện khác trước.`);
        return;
    }
    openDeleteModal(
        'Xác Nhận Xóa Huyện',
        `Bạn có chắc chắn muốn xóa huyện <strong class="text-slate-800">"${distName}"</strong> không?`,
        () => {
            removeDistrict(distName);
            saveDistricts();
            renderDistrictGrid(document.getElementById('district-search-input').value);
            renderAgents();
            showToast('Đã xóa huyện!');
        }
    );
}

function openRankingModal() {
    renderRankingList();
    openModalById('ranking-modal-backdrop', 'ranking-modal');
}

function closeRankingModal() {
    closeModalById('ranking-modal-backdrop', 'ranking-modal');
}

function openModal(editMode = false) {
    openModalById('modal-backdrop', 'agent-modal');
    if (!editMode) {
        document.getElementById('modal-title').textContent = 'Thêm Đại Lý Mới';
        document.getElementById('agent-form').reset();
        document.getElementById('agent-id').value = '';
        document.getElementById('form-district').value = state.currentDistrict;
    }
}

function closeModal() {
    closeModalById('modal-backdrop', 'agent-modal');
}

function saveAgent(event) {
    event.preventDefault();
    const id = document.getElementById('agent-id').value;
    const data = {
        district: document.getElementById('form-district').value,
        name: document.getElementById('form-name').value.trim(),
        owner: document.getElementById('form-owner').value.trim(),
        phone: document.getElementById('form-phone').value.trim(),
        address: document.getElementById('form-address').value.trim(),
        mapQuery: document.getElementById('form-map-query').value.trim(),
        note: document.getElementById('form-note').value.trim()
    };

    if (id) {
        const updated = updateAgent(id, data);
        showToast('Đã cập nhật đại lý!');
        if (state.activeAgentId === id && updated) renderAgentDetail(updated);
    } else {
        addAgent(data);
        showToast('Thêm đại lý thành công!');
    }

    saveToLocalStorage(updateStats);
    state.currentDistrict = data.district;
    renderAgents();
    closeModal();
}

function editAgent(id) {
    const agent = findAgent(id);
    if (!agent) return;
    document.getElementById('modal-title').textContent = 'Chỉnh Sửa Đại Lý';
    document.getElementById('agent-id').value = agent.id;
    document.getElementById('form-district').value = agent.district;
    document.getElementById('form-name').value = agent.name;
    document.getElementById('form-owner').value = agent.owner || '';
    document.getElementById('form-phone').value = agent.phone || '';
    document.getElementById('form-address').value = agent.address || '';
    document.getElementById('form-map-query').value = agent.mapQuery || '';
    document.getElementById('form-note').value = agent.note || '';
    openModal(true);
}

function editAgentFromDetail() {
    if (state.activeAgentId) editAgent(state.activeAgentId);
}

function confirmDeleteAgent(id) {
    const agent = findAgent(id);
    if (!agent) return;
    openDeleteModal(
        'Xác Nhận Xóa Đại Lý',
        `Bạn có chắc chắn muốn xóa đại lý <strong class="text-slate-800">"${agent.name}"</strong> không?`,
        () => {
            deleteAgent(id);
            saveToLocalStorage(updateStats);
            if (state.activeAgentId === id) showHomeView();
            else renderAgents();
            showToast('Đã xóa đại lý thành công!');
        }
    );
}

function openConfigSalesModal() {
    const agent = findAgent(state.activeAgentId);
    if (!agent) return;
    document.getElementById('form-target-sales').value = agent.targetSales || '';
    openModalById('sales-modal-backdrop', 'sales-modal');
}

function closeSalesModal() {
    closeModalById('sales-modal-backdrop', 'sales-modal');
}

function saveSalesConfig(e) {
    e.preventDefault();
    const agent = findAgent(state.activeAgentId);
    if (!agent) return;
    agent.targetSales = Number(document.getElementById('form-target-sales').value) || 0;
    saveToLocalStorage(updateStats);
    renderSalesTab(agent);
    closeSalesModal();
    showToast('Đã cập nhật mục tiêu năm!');
}

function updateDaySales(month, day, value) {
    const agent = findAgent(state.activeAgentId);
    if (!agent) return;

    if (!agent.dailySales) agent.dailySales = {};
    if (!agent.dailySales[month]) agent.dailySales[month] = {};

    const num = Number(value);
    if (num > 0) {
        agent.dailySales[month][day] = num;
    } else {
        delete agent.dailySales[month][day];
    }

    saveToLocalStorage(updateStats);

    let monthTotal = 0;
    const daysObj = agent.dailySales[month] || {};
    for (const d in daysObj) monthTotal += Number(daysObj[d]) || 0;
    document.getElementById('daily-month-total').textContent = `${formatTon(monthTotal)} Tấn`;
}

let currentFarmerBase64Image = '';

function openAddFarmerModal(editFarmerData = null) {
    currentFarmerBase64Image = '';
    const previewImg = document.getElementById('farmer-preview-img');
    const placeholder = document.getElementById('farmer-upload-placeholder');

    if (editFarmerData) {
        document.getElementById('farmer-modal-title').textContent = 'Sửa Nông Dân';
        document.getElementById('farmer-form-id').value = editFarmerData.id;
        document.getElementById('farmer-form-name').value = editFarmerData.name || '';
        document.getElementById('farmer-form-phone').value = editFarmerData.phone || '';
        document.getElementById('farmer-form-area').value = editFarmerData.area || '';
        document.getElementById('farmer-form-map').value = editFarmerData.mapQuery || '';
        document.getElementById('farmer-form-zalo').value = editFarmerData.zalo || '';
        document.getElementById('farmer-form-products').value = editFarmerData.products || '';

        if (editFarmerData.image) {
            currentFarmerBase64Image = editFarmerData.image;
            previewImg.src = editFarmerData.image;
            previewImg.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            previewImg.src = '';
            previewImg.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    } else {
        document.getElementById('farmer-modal-title').textContent = 'Thêm Nông Dân Mới';
        document.getElementById('farmer-form-id').value = '';
        document.getElementById('farmer-form-name').value = '';
        document.getElementById('farmer-form-phone').value = '';
        document.getElementById('farmer-form-area').value = '';
        document.getElementById('farmer-form-map').value = '';
        document.getElementById('farmer-form-zalo').value = '';
        document.getElementById('farmer-form-products').value = '';
        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholder.classList.remove('hidden');
    }

    openModalById('farmer-modal-backdrop', 'farmer-modal');
}

function closeFarmerModal() {
    closeModalById('farmer-modal-backdrop', 'farmer-modal');
}

async function handleFarmerImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
        currentFarmerBase64Image = await processImageToBase64(file);
        const previewImg = document.getElementById('farmer-preview-img');
        const placeholder = document.getElementById('farmer-upload-placeholder');
        previewImg.src = currentFarmerBase64Image;
        previewImg.classList.remove('hidden');
        placeholder.classList.add('hidden');
    } catch (err) {
        showToast('Không thể xử lý ảnh', 'error');
    }
}

function saveFarmer(e) {
    e.preventDefault();
    const agent = findAgent(state.activeAgentId);
    if (!agent) return;

    const id = document.getElementById('farmer-form-id').value;
    const data = {
        name: document.getElementById('farmer-form-name').value.trim(),
        phone: document.getElementById('farmer-form-phone').value.trim(),
        area: document.getElementById('farmer-form-area').value.trim(),
        mapQuery: document.getElementById('farmer-form-map').value.trim(),
        zalo: document.getElementById('farmer-form-zalo').value.trim(),
        products: document.getElementById('farmer-form-products').value.trim(),
        image: currentFarmerBase64Image
    };

    if (id) {
        updateFarmer(state.activeAgentId, id, data);
        showToast('Đã cập nhật nông dân!');
    } else {
        addFarmer(state.activeAgentId, data);
        showToast('Thêm nông dân thành công!');
    }

    saveToLocalStorage(updateStats);
    renderFarmersTab(agent);
    closeFarmerModal();
}

function editFarmer(farmerId) {
    const agent = findAgent(state.activeAgentId);
    if (!agent?.farmers) return;
    const farmer = agent.farmers.find((f) => f.id === farmerId);
    if (farmer) openAddFarmerModal(farmer);
}

function confirmDeleteFarmer(farmerId) {
    const agent = findAgent(state.activeAgentId);
    if (!agent?.farmers) return;
    const farmer = agent.farmers.find((f) => f.id === farmerId);
    if (!farmer) return;

    openDeleteModal(
        'Xác Nhận Xóa Nông Dân',
        `Bạn có chắc muốn xóa nông dân <strong class="text-slate-800">"${farmer.name}"</strong> khỏi danh sách?`,
        () => {
            deleteFarmer(state.activeAgentId, farmerId);
            saveToLocalStorage(updateStats);
            renderFarmersTab(agent);
            showToast('Đã xóa nông dân!');
        }
    );
}

function autoFillZalo(phoneInput) {
    const phoneVal = phoneInput.value.trim();
    const zaloInput = document.getElementById('farmer-form-zalo');
    if (phoneVal) {
        const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
        if (cleanPhone) zaloInput.value = `https://zalo.me/${cleanPhone}`;
    }
}

async function handleAgentImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const base64 = await processImageToBase64(file);
        const agent = findAgent(state.activeAgentId);
        if (agent) {
            agent.image = base64;
            saveToLocalStorage(updateStats);
            renderAgentDetail(agent);
            showToast('Đã cập nhật ảnh đại lý!');
        }
    } catch (err) {
        showToast('Không thể xử lý ảnh', 'error');
    }
}

function exportToCSV() {
    if (state.agents.length === 0) {
        alert('Chưa có dữ liệu!');
        return;
    }
    let csvContent = '\uFEFFSTT,Tỉnh,Huyện/Thị xã,Tên Đại Lý,Chủ Đại Lý,Số Điện Thoại,Địa Chỉ,Mục Tiêu (Tấn),Hiện Tại (Tấn),Hoàn Thành\n';
    state.agents.forEach((a, index) => {
        const current = getAgentTotalTonnes(a);
        const target = a.targetSales || 0;
        const percent = target > 0 ? Math.round((current / target) * 100) : 0;
        const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
        csvContent += `${index + 1},Kiên Giang,${cell(a.district)},${cell(a.name)},${cell(a.owner || '')},${cell(a.phone || '')},${cell(a.address || '')},${cell(target)},${cell(current)},${cell(`${percent}%`)}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Dai_Ly_Kien_Giang.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Excel!');
}

window.showHomeView = showHomeView;
window.showDetailView = showDetailView;
window.openDailyView = openDailyView;
window.closeDailyView = closeDailyView;
window.switchDetailTab = switchDetailTab;
window.toggleTotalTonnesVisibility = toggleTotalTonnesVisibility;
window.toggleMonthTonnesVisibility = toggleMonthTonnesVisibility;
window.openDistrictDialog = openDistrictDialog;
window.closeDistrictDialog = closeDistrictDialog;
window.openAddDistrictModal = openAddDistrictModal;
window.closeAddDistrictModal = closeAddDistrictModal;
window.saveDistrict = saveDistrict;
window.openRankingModal = openRankingModal;
window.closeRankingModal = closeRankingModal;
window.openModal = openModal;
window.closeModal = closeModal;
window.saveAgent = saveAgent;
window.editAgentFromDetail = editAgentFromDetail;
window.openConfigSalesModal = openConfigSalesModal;
window.closeSalesModal = closeSalesModal;
window.saveSalesConfig = saveSalesConfig;
window.openAddFarmerModal = openAddFarmerModal;
window.closeFarmerModal = closeFarmerModal;
window.saveFarmer = saveFarmer;
window.handleFarmerImageSelect = handleFarmerImageSelect;
window.handleAgentImageSelect = handleAgentImageSelect;
window.autoFillZalo = autoFillZalo;
window.exportToCSV = exportToCSV;
window.closeLightbox = closeLightbox;
window.closeDeleteModal = closeDeleteModal;
window.clearSearch = clearSearch;
window.clearDistrictSearch = clearDistrictSearch;
window.handleSearchInput = handleSearchInput;
window.handleDistrictSearchInput = handleDistrictSearchInput;
