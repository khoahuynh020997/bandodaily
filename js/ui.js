/**
 * ui.js - Các hàm tiện ích UI chung (toast, modal, view switching)
 */

export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    document.getElementById('toast-message').textContent = message;

    if (type === 'error') {
        icon.className = 'fa-solid fa-circle-exclamation text-rose-400 text-base';
    } else {
        icon.className = 'fa-solid fa-circle-check text-emerald-400 text-base';
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
}

export function openModalById(backdropId, modalId) {
    document.getElementById(backdropId)?.classList.remove('hidden');
    document.getElementById(modalId)?.classList.remove('hidden');
}

export function closeModalById(backdropId, modalId) {
    document.getElementById(backdropId)?.classList.add('hidden');
    document.getElementById(modalId)?.classList.add('hidden');
}

export function showView(viewId) {
    const views = ['home-view', 'detail-view', 'daily-sales-view'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === viewId) {
            el.classList.remove('hidden');
            el.classList.add('flex');
        } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });
    window.scrollTo(0, 0);
}

let _deleteConfirmCallback = null;

export function openDeleteModal(title, descHtml, onConfirm) {
    document.getElementById('delete-modal-title').textContent = title;
    document.getElementById('delete-modal-desc').innerHTML = descHtml;
    _deleteConfirmCallback = onConfirm;

    const confirmBtn = document.getElementById('confirm-delete-btn');
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.onclick = () => {
        if (_deleteConfirmCallback) _deleteConfirmCallback();
        closeDeleteModal();
    };

    openModalById('delete-modal-backdrop', 'delete-modal');
}

export function closeDeleteModal() {
    closeModalById('delete-modal-backdrop', 'delete-modal');
    _deleteConfirmCallback = null;
}

export function openLightbox(imgSrc) {
    if (!imgSrc) return;
    const lightbox = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    img.src = imgSrc;
    img.classList.remove('scale-150');
    img.classList.add('scale-100');
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
}

export function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
}

export function toggleZoom(imgEl) {
    if (imgEl.classList.contains('scale-100')) {
        imgEl.classList.remove('scale-100');
        imgEl.classList.add('scale-150');
    } else {
        imgEl.classList.remove('scale-150');
        imgEl.classList.add('scale-100');
    }
}