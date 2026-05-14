// AEDES modal utility — smooth, reusable modals
(function() {
    var modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .a-modal-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s ease;
        }
        .a-modal-overlay.active { opacity: 1; visibility: visible; }
        .a-modal-overlay::-webkit-scrollbar { width: 4px; }
        .a-modal-overlay::-webkit-scrollbar-track { background: transparent; }
        .a-modal-overlay::-webkit-scrollbar-thumb { background: var(--border, #e5e7eb); border-radius: 100px; }

        .a-modal {
            background: var(--bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 16px;
            padding: 2rem;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            opacity: 0;
            transform: scale(0.95) translateY(10px);
            transition: opacity 0.25s ease, transform 0.25s ease;
            max-height: 90vh;
            overflow-y: auto;
        }
        .a-modal::-webkit-scrollbar { width: 4px; }
        .a-modal::-webkit-scrollbar-track { background: transparent; }
        .a-modal::-webkit-scrollbar-thumb { background: var(--border, #e5e7eb); border-radius: 100px; }
        .a-modal::-webkit-scrollbar-thumb:hover { background: var(--txt3, #9ca3af); }
        .a-modal-overlay.active .a-modal {
            opacity: 1;
            transform: scale(1) translateY(0);
        }

        .a-modal-hdr {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        .a-modal-hdr h2 { font-size: 1.125rem; font-weight: 600; }

        .a-modal-close {
            width: 32px; height: 32px;
            border-radius: 8px;
            border: 1px solid var(--border, #e5e7eb);
            background: var(--bg2, #f8f9fa);
            color: var(--txt2, #6b7280);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s;
        }
        .a-modal-close:hover { background: var(--bg3, #f0f1f2); }

        .a-modal-ftr {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--border, #e5e7eb);
        }

        .dark-mode .a-modal {
            border-color: var(--border, #27272a);
        }
        .dark-mode .a-modal-close {
            border-color: var(--border, #27272a);
            background: var(--bg2, #141414);
        }
    `;
    document.head.appendChild(modalStyles);

    window.AedModal = {
        open: function(overlayId) {
            var overlay = document.getElementById(overlayId);
            if (!overlay) return;
            overlay.classList.add('active');
        },

        close: function(overlayId) {
            var overlay = document.getElementById(overlayId);
            if (!overlay) return;
            overlay.classList.remove('active');
        },

        init: function(overlayId, options) {
            var overlay = document.getElementById(overlayId);
            if (!overlay) return;
            options = options || {};

            var closeBtn = overlay.querySelector('.a-modal-close');
            var cancelBtn = overlay.querySelector('.a-modal-cancel');
            var modal = overlay.querySelector('.a-modal');

            if (closeBtn) closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                AedModal.close(overlayId);
            });
            if (cancelBtn) cancelBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                AedModal.close(overlayId);
            });

            overlay.addEventListener('click', function() {
                AedModal.close(overlayId);
            });
            if (modal) modal.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            if (options.onOpen) {
                var openBtn = document.getElementById(options.openBtnId);
                if (openBtn) openBtn.addEventListener('click', function() {
                    AedModal.open(overlayId);
                    if (options.onOpen) options.onOpen();
                });
            } else if (options.openBtnId) {
                var openBtn = document.getElementById(options.openBtnId);
                if (openBtn) openBtn.addEventListener('click', function() {
                    AedModal.open(overlayId);
                });
            }

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    AedModal.close(overlayId);
                }
            });
        }
    };
})();
