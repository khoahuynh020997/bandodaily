/**
 * activation.js - Mã kích hoạt app
 */
import { STORAGE_KEYS, VALID_CODES } from './config.js';
import { showToast } from './ui.js';

function isActivated() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVATED) === '1';
}

function setActivated() {
    localStorage.setItem(STORAGE_KEYS.ACTIVATED, '1');
}

function normalizeCode(raw) {
    return String(raw || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/–|—/g, '-');
}

function ensureActivationModal() {
    if (document.getElementById('activation-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <div id="activation-backdrop" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100]"></div>
    <div id="activation-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-slate-100">
            <div class="text-center">
                <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                    <i class="fa-solid fa-key"></i>
                </div>
                <h3 class="text-base font-bold text-slate-800">Kích hoạt Bản Đồ Đại Lý</h3>
            </div>
            <form id="activation-form" class="space-y-3">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã kích hoạt</label>
                    <input type="text" id="activation-code-input" placeholder="NHẬP KEY ĐỂ SỬ DỤNG"
                           autocomplete="off" autocapitalize="characters"
                           class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm tracking-wide rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center"
                           required>
                    <p id="activation-error" class="hidden text-xs text-rose-600 mt-1.5 text-center font-semibold"></p>
                </div>
                <button type="submit" class="w-full py-3 bg-emerald-600 active-touch text-white font-bold rounded-xl text-sm shadow-sm">
                    <i class="fa-solid fa-unlock-keyhole me-1"></i> Kích hoạt
                </button>
            </form>
            <div class="text-center space-y-1.5 pt-1 border-t border-slate-100">
                <p class="text-[11px] text-slate-500">
                    Liên hệ hỗ trợ nhận key:
                    <a href="http://zalo.me/0845325488" target="_blank" rel="noopener" class="text-emerald-600 font-bold underline underline-offset-2">zalo.me/0845325488</a>
                </p>
                <p class="text-[10px] text-slate-400">
                    Phần mềm được viết bởi <strong class="text-emerald-700">KHOA HOA KỲ</strong>
                </p>
            </div>
        </div>
    </div>`;
    document.body.appendChild(wrap);
    document.getElementById('activation-form').addEventListener('submit', submitActivationCode);
}

function hideActivationScreen() {
    document.getElementById('activation-backdrop')?.classList.add('hidden');
    const modal = document.getElementById('activation-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    document.getElementById('app-container')?.classList.remove('hidden');
}

function showActivationScreen(onSuccess) {
    ensureActivationModal();
    document.getElementById('activation-backdrop')?.classList.remove('hidden');
    const modal = document.getElementById('activation-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    document.getElementById('app-container')?.classList.add('hidden');
    window.__activationOnSuccess = onSuccess;
}

function submitActivationCode(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('activation-code-input');
    const errorEl = document.getElementById('activation-error');
    const code = normalizeCode(input?.value);

    if (!code) {
        if (errorEl) {
            errorEl.textContent = 'Vui lòng nhập mã kích hoạt.';
            errorEl.classList.remove('hidden');
        }
        return;
    }

    const valid = VALID_CODES.some((c) => normalizeCode(c) === code);
    if (!valid) {
        if (errorEl) {
            errorEl.textContent = 'Mã không hợp lệ. Vui lòng kiểm tra lại.';
            errorEl.classList.remove('hidden');
        }
        return;
    }

    setActivated();
    hideActivationScreen();
    if (typeof window.__activationOnSuccess === 'function') {
        window.__activationOnSuccess();
    }
    showToast('Kích hoạt thành công!');
}

export function requireActivation(onSuccess) {
    if (isActivated()) {
        onSuccess();
        return;
    }
    showActivationScreen(onSuccess);
}
