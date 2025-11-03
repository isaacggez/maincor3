// frontend/js/ui.js

// ==================== UTILITÁRIOS DE UI ====================
window.ui = {
  /**
   * Exibe alertas no topo da tela
   * @param {string} msg - Mensagem a ser exibida
   * @param {string} tipo - Tipo do alerta: "success", "danger", "warning", "info"
   */
  alert(msg, tipo = "info") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${tipo} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
    alert.style.zIndex = "9999";
    alert.textContent = msg;

    // Adiciona o alerta na tela
    document.body.appendChild(alert);

    // Remove após 4 segundos
    setTimeout(() => alert.remove(), 4000);
  },

  /**
   * Função de confirmação personalizada
   * @param {string} msg - Mensagem de confirmação
   * @returns {boolean} - true se confirmado, false caso contrário
   */
  confirmar(msg) {
    return confirm(msg);
  },

  /**
   * Controla modais do Bootstrap
   * @param {string} id - ID do modal
   * @param {string} action - "show" ou "hide"
   */
  modal(id, action = "show") {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    action === "show" ? modal.show() : modal.hide();
  },

  /**
   * Exibe ou remove overlay de loading
   * @param {boolean} state - true para exibir, false para remover
   */
  loading(state = true) {
    if (state) {
      const overlay = document.createElement("div");
      overlay.id = "ui-loading";
      overlay.className = "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50";
      overlay.innerHTML = `<div class="spinner-border text-light" role="status"></div>`;
      document.body.appendChild(overlay);
    } else {
      document.getElementById("ui-loading")?.remove();
    }
  }
};

// Correções de UX: previne scroll em anchors "#" e mantém comportamento de modais
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('a[href^="#"]');
  if (!a) return;

  const href = a.getAttribute('href');
  const hasBsToggle = a.dataset.bsToggle || a.dataset.bsToggle === "modal" || a.hasAttribute('data-bs-toggle');

  // sempre prevenir navegação padrão para href="#" (evita scroll)
  if (href === '#') {
    ev.preventDefault();
    return;
  }

  // se é um link para um modal (data-bs-toggle), prevenir scroll e deixar o Bootstrap abrir o modal
  if (href.startsWith('#') && hasBsToggle) {
    ev.preventDefault();
    // se o Bootstrap estiver disponível, ativar manualmente (fallback)
    try {
      if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
        const modalEl = document.querySelector(href);
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }
    } catch (err) { /* ignore */ }
  }
});

// Previne scroll ao clicar em links de modal
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Se tem data-bs-toggle="modal", previne comportamento padrão
    if (target.getAttribute('data-bs-toggle') === 'modal') {
        e.preventDefault();
        return false;
    }
    
    // Se é link para # ou #algo, previne scroll
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        return false;
    }
});

// Força modal a abrir no topo
document.addEventListener('show.bs.modal', function (event) {
    const modal = event.target;
    modal.scrollTop = 0;
});
