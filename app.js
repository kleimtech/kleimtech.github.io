/**
 * LÓGICA PRINCIPAL DE LA APLICACIÓN - KLEIM TECH
 * Renderizado reactivo, Mega-Menu, filtrado, tarjetas interactivas,
 * cálculo dinámico de costo/stock, modal de detalles con galería de imágenes y pedidos por WhatsApp.
 */

// Función para procesar precio y stock antes de renderizar
function obtenerDatosCalculados(producto) {
  const margenGeneral = typeof MARGEN_GANANCIA_GENERAL !== "undefined" ? MARGEN_GANANCIA_GENERAL : 15;
  const porcentaje = producto.ganancia || margenGeneral;
  
  // Si el costo es 0 o menor, está AGOTADO
  if (!producto.costo || producto.costo <= 0) {
    return {
      precioVenta: "0.00",
      disponible: false,
      estadoTexto: "Agotado"
    };
  }

  // Cálculo del precio final con margen de ganancia
  const precioFinal = producto.costo * (1 + porcentaje / 100);

  return {
    precioVenta: precioFinal.toFixed(2),
    disponible: true,
    estadoTexto: "Disponible"
  };
}

(function () {
  "use strict";

  // Estado reactivo de la aplicación
  const state = {
    selectedCategory: "todos",
    selectedSubcategory: null,
    searchQuery: "",
    hideOutOfStock: false,
    sortBy: "default",
    activeProductModal: null
  };

  // Referencias al DOM
  const DOM = {
    mainNav: document.getElementById("mainNav"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    activeFilterBadge: document.getElementById("activeFilterBadge"),
    activeFilterText: document.getElementById("activeFilterText"),
    clearActiveFilterBtn: document.getElementById("clearActiveFilterBtn"),
    productsGrid: document.getElementById("productsGrid"),
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    hideOutOfStockToggle: document.getElementById("hideOutOfStockToggle"),
    sortSelect: document.getElementById("sortSelect"),
    resultsCount: document.getElementById("resultsCount"),
    emptyState: document.getElementById("emptyState"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    brandName: document.getElementById("brandName"),
    brandTagline: document.getElementById("brandTagline"),
    headerContactBtn: document.getElementById("headerContactBtn"),
    floatingWhatsappBtn: document.getElementById("floatingWhatsappBtn"),
    footerStoreName: document.getElementById("footerStoreName"),
    footerCopyrightName: document.getElementById("footerCopyrightName"),
    footerLocation: document.getElementById("footerLocation"),
    footerWhatsappLink: document.getElementById("footerWhatsappLink"),
    footerInstagramLink: document.getElementById("footerInstagramLink"),
    currentYear: document.getElementById("currentYear"),
    // Elementos del Modal
    productModal: document.getElementById("productModal"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalCloseBtn: document.getElementById("modalCloseBtn"),
    modalBody: document.getElementById("modalBody")
  };

  // Imagen fallback SVG
  const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%20fill%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23111827%22%2F%3E%3Cpath%20d%3D%22M175%20130h50v40h-50z%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2265%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3EHardware%20PC%3C%2Ftext%3E%3C%2Fsvg%3E";

  function normalizeText(str) {
    if (!str) return "";
    return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function normalizeCategory(cat) {
    if (!cat) return "";
    const lower = normalizeText(cat);
    if (lower.includes("procesador") || lower === "cpu") return "procesadores";
    if (lower.includes("madre") || lower.includes("mother") || lower.includes("placa")) return "tarjetas madre";
    if (lower.includes("video") || lower.includes("grafica") || lower === "gpu") return "tarjetas de video";
    if (lower.includes("ram") || lower.includes("almacen") || lower.includes("disco") || lower.includes("ssd") || lower.includes("m.2")) return "almacenamiento y ram";
    if (lower.includes("componente") || lower.includes("fuente") || lower.includes("enfria") || lower.includes("chasis") || lower.includes("case")) return "componentes";
    if (lower.includes("equipo") || lower.includes("laptop") || lower.includes("mini pc") || lower.includes("tablet")) return "equipos";
    if (lower.includes("periferico") || lower.includes("monitor") || lower.includes("teclado") || lower.includes("audio") || lower.includes("redes")) return "perifericos";
    return lower;
  }

  function ordenarProductos(lista, criterio) {
    return lista.sort((a, b) => {
      const datosA = obtenerDatosCalculados(a);
      const datosB = obtenerDatosCalculados(b);

      if (criterio === "price-asc") return parseFloat(datosA.precioVenta) - parseFloat(datosB.precioVenta);
      if (criterio === "price-desc") return parseFloat(datosB.precioVenta) - parseFloat(datosA.precioVenta);
      if (criterio === "name-asc") return a.nombre.localeCompare(b.nombre);
      return 0;
    });
  }

  function formatCurrency(amount) {
    const symbol = (typeof CATALOG_CONFIG !== "undefined" && CATALOG_CONFIG.currencySymbol) || "$";
    const currencyCode = (typeof CATALOG_CONFIG !== "undefined" && CATALOG_CONFIG.currency) || "USD";
    return `${symbol}${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="price-currency">${currencyCode}</span>`;
  }

  function buildWhatsAppLink(product, datosCalculados) {
    const store = (typeof CATALOG_CONFIG !== "undefined" && CATALOG_CONFIG.storeName) || "Kleim Tech";
    const datos = datosCalculados || obtenerDatosCalculados(product);
    let message = "";

    if (datos.disponible) {
      message = `Hola ${store}! Me interesa comprar el siguiente producto de su catálogo:\n\n` +
        `• *${product.nombre}*\n` +
        `• Categoría: ${product.categoria} ${product.subcategoria ? `(${product.subcategoria})` : ""}\n` +
        `• Precio: $${datos.precioVenta} USD\n\n` +
        `¿Tienen disponibilidad para coordinar el pago y la entrega? Muchas gracias.`;
    } else {
      message = `Hola ${store}! Vi en el catálogo el siguiente producto que figura *${datos.estadoTexto}*:\n\n` +
        `• *${product.nombre}*\n\n` +
        `¿Tienen fecha estimada de reposición o pueden reservarme uno? Gracias.`;
    }

    const waNumber = (typeof CATALOG_CONFIG !== "undefined" && CATALOG_CONFIG.whatsappNumber) || "";
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Genera el HTML de la tarjeta del producto
   */
  function createProductCard(product) {
    const datos = obtenerDatosCalculados(product);
    const isAvailable = datos.disponible;
    const cardStatusClass = isAvailable ? "" : "out-of-stock";
    const waUrl = buildWhatsAppLink(product, datos);

    const normCat = normalizeCategory(product.categoria);
    const catObj = (typeof CATEGORIAS !== "undefined" ? CATEGORIAS : []).find(c => c.id === normCat);
    const categoryDisplay = catObj ? catObj.nombre : product.categoria;
    const subcategoryDisplay = product.subcategoria ? ` &bull; ${product.subcategoria}` : "";

    const tagBadge = product.tag ? `<span class="badge-tag">${product.tag}</span>` : "";
    const categoryBadge = `<span class="badge-category">${categoryDisplay}${subcategoryDisplay}</span>`;
    const stockBadge = isAvailable
      ? `<span class="badge-stock available"><span class="stock-dot"></span>${datos.estadoTexto}</span>`
      : `<span class="badge-stock unavailable"><span class="stock-dot"></span>${datos.estadoTexto}</span>`;

    const specsHtml = (product.specs || [])
      .map(spec => `<li class="spec-item"><span class="spec-bullet">▸</span><span>${spec}</span></li>`)
      .join("");

    const priceDisplayHtml = isAvailable
      ? `<div class="price-current">${formatCurrency(datos.precioVenta)}</div>`
      : `<div class="price-current" style="color: #94a3b8; font-size: 1.15rem; font-weight: 700; text-transform: uppercase;">${datos.estadoTexto}</div>`;

    const buttonHtml = isAvailable
      ? `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp available" onclick="event.stopPropagation();">
          <span>Comprar por WhatsApp</span>
        </a>`
      : `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp unavailable" onclick="event.stopPropagation();">
          <span>Consultar reposición</span>
        </a>`;

    return `
      <article class="product-card ${cardStatusClass}" data-id="${product.id}">
        <div class="card-media">
          ${tagBadge}
          ${categoryBadge}
          <img src="${product.imagen}" alt="${product.nombre}" class="card-img" loading="lazy" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
          ${stockBadge}
        </div>
        <div class="card-content">
          <h2 class="card-title">${product.nombre}</h2>
          <ul class="card-specs">${specsHtml}</ul>
          <div class="card-price-row">${priceDisplayHtml}</div>
          ${buttonHtml}
        </div>
      </article>
    `;
  }

  /**
   * ABRE EL MODAL CON EL DETALLE DEL PRODUCTO
   */
  function openProductModal(productId) {
    const productList = (typeof productos !== "undefined" ? productos : (typeof PRODUCTOS_DATA !== "undefined" ? PRODUCTOS_DATA : []));
    const product = productList.find(p => String(p.id) === String(productId));
    
    if (!product || !DOM.productModal || !DOM.modalBody) return;

    const datos = obtenerDatosCalculados(product);
    const waUrl = buildWhatsAppLink(product, datos);

    // Si tiene un array de imágenes, se usan. Si no, se usa la principal
    const imagenes = product.imagenes && product.imagenes.length > 0 ? product.imagenes : [product.imagen];

    // HTML de miniaturas si hay más de 1 imagen
    const galleryThumbsHtml = imagenes.length > 1 ? `
      <div class="modal-thumbs">
        ${imagenes.map((img, idx) => `
          <img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}" data-full-img="${img}" onclick="window.appChangeModalImg(this)" alt="Vista miniatura">
        `).join('')}
      </div>
    ` : '';

    const specsListHtml = (product.specs || []).map(s => `<li>▸ ${s}</li>`).join('');

    DOM.modalBody.innerHTML = `
      <div class="modal-product-container">
        <div class="modal-gallery">
          <div class="modal-main-img-wrap">
            <img id="modalMainImg" src="${imagenes[0]}" alt="${product.nombre}" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
          </div>
          ${galleryThumbsHtml}
        </div>
        <div class="modal-info">
          <span class="modal-category">${product.categoria} ${product.subcategoria ? ' / ' + product.subcategoria : ''}</span>
          <h2 class="modal-title">${product.nombre}</h2>
          <div class="modal-price-box">
            ${datos.disponible ? formatCurrency(datos.precioVenta) : `<span class="out">${datos.estadoTexto}</span>`}
          </div>
          <p class="modal-description">${product.descripcion || 'Sin descripción detallada disponible.'}</p>
          <div class="modal-specs">
            <h4>Especificaciones clave:</h4>
            <ul>${specsListHtml}</ul>
          </div>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp ${datos.disponible ? 'available' : 'unavailable'}" style="margin-top:15px; text-align:center; display:flex; justify-content:center;">
            <span>${datos.disponible ? 'Comprar por WhatsApp' : 'Consultar Reposición'}</span>
          </a>
        </div>
      </div>
    `;

    DOM.productModal.classList.add("open");
    if (DOM.modalOverlay) DOM.modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Bloquea scroll del fondo
  }

  /**
   * CIERRA EL MODAL
   */
  function closeProductModal() {
    if (DOM.productModal) DOM.productModal.classList.remove("open");
    if (DOM.modalOverlay) DOM.modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Cambiar imagen en la galería del modal
  window.appChangeModalImg = function (thumbElement) {
    const mainImg = document.getElementById("modalMainImg");
    if (mainImg && thumbElement) {
      mainImg.src = thumbElement.getAttribute("data-full-img");
      document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      thumbElement.classList.add("active");
    }
  };

  function updateActiveFilterUI() {
    if (!DOM.activeFilterBadge || !DOM.activeFilterText) return;

    if (state.selectedSubcategory) {
      DOM.activeFilterText.textContent = `${state.selectedCategory} > ${state.selectedSubcategory}`;
      DOM.activeFilterBadge.style.display = "inline-flex";
    } else if (state.selectedCategory && state.selectedCategory !== "todos") {
      DOM.activeFilterText.textContent = state.selectedCategory;
      DOM.activeFilterBadge.style.display = "inline-flex";
    } else {
      DOM.activeFilterBadge.style.display = "none";
    }

    document.querySelectorAll(".header__nav-link").forEach(link => {
      const navCat = link.getAttribute("data-nav-category");
      if (!navCat) return;

      if (state.selectedCategory === "todos" && navCat === "todos") {
        link.classList.add("active");
      } else if (state.selectedCategory !== "todos" && normalizeCategory(navCat) === normalizeCategory(state.selectedCategory)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function applyFilters() {
    const rawSearch = state.searchQuery.trim().toLowerCase();
    const searchTerms = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : [];

    const productList = (typeof productos !== "undefined" ? productos : (typeof PRODUCTOS_DATA !== "undefined" ? PRODUCTOS_DATA : []));
    const totalAvailableInStore = productList.length;

    let filtered = productList.filter(item => {
      const datos = obtenerDatosCalculados(item);

      if (state.hideOutOfStock && !datos.disponible) return false;

      if (state.selectedCategory && state.selectedCategory !== "todos") {
        if (normalizeCategory(item.categoria) !== normalizeCategory(state.selectedCategory)) return false;
      }

      if (state.selectedSubcategory) {
        const normItemSub = normalizeText(item.subcategoria);
        const normSelectedSub = normalizeText(state.selectedSubcategory);
        if (!(normItemSub === normSelectedSub || normItemSub.includes(normSelectedSub) || normSelectedSub.includes(normItemSub))) return false;
      }

      if (searchTerms.length > 0) {
        const searchableText = `${item.nombre} ${(item.specs || []).join(" ")} ${item.categoria} ${item.subcategoria || ""} ${datos.estadoTexto}`.toLowerCase();
        if (!searchTerms.every(term => searchableText.includes(term))) return false;
      }

      return true;
    });

    filtered = ordenarProductos(filtered, state.sortBy);
    updateActiveFilterUI();
    renderProducts(filtered, totalAvailableInStore);
  }

  function renderProducts(items, totalCount) {
    if (!DOM.productsGrid) return;

    if (items.length === 0) {
      DOM.productsGrid.innerHTML = "";
      if (DOM.emptyState) DOM.emptyState.classList.add("visible");
      if (DOM.resultsCount) DOM.resultsCount.innerHTML = `Mostrando <strong>0</strong> productos`;
      return;
    }

    if (DOM.emptyState) DOM.emptyState.classList.remove("visible");
    if (DOM.resultsCount) DOM.resultsCount.innerHTML = `Mostrando <strong>${items.length}</strong> de ${totalCount} productos`;

    DOM.productsGrid.innerHTML = items.map(createProductCard).join("");

    // EVENT LISTENER PARA CLIC EN LA TARJETA (Abre Modal)
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        openProductModal(id);
      });
    });
  }

  function closeMobileMenu() {
    if (DOM.mainNav) DOM.mainNav.classList.remove("nav-open");
    if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.classList.remove("active");
  }

  function scrollToProducts() {
    const target = DOM.activeFilterBadge || DOM.productsGrid || DOM.resultsCount;
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  }

  window.appFilterCategory = function (categoryName) {
    state.selectedCategory = categoryName;
    state.selectedSubcategory = null;
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  window.appFilterSubcategory = function (categoryName, subcategoryName) {
    state.selectedCategory = categoryName;
    state.selectedSubcategory = subcategoryName;
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  window.appResetAllFilters = function () {
    state.selectedCategory = "todos";
    state.selectedSubcategory = null;
    state.searchQuery = "";
    state.sortBy = "default";
    if (DOM.sortSelect) DOM.sortSelect.value = "default";
    if (DOM.searchInput) DOM.searchInput.value = "";
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = "none";
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  function initStoreInfo() {
    if (typeof CATALOG_CONFIG === "undefined") return;

    if (DOM.brandName) {
      const parts = (CATALOG_CONFIG.storeName || "Kleim Tech").trim().split(" ");
      if (parts.length >= 2) {
        DOM.brandName.innerHTML = `<span class="brand-kleim">${parts[0].toUpperCase()}</span> <span class="brand-tech">${parts.slice(1).join(" ").toUpperCase()}</span>`;
      } else {
        DOM.brandName.textContent = CATALOG_CONFIG.storeName || "Kleim Tech";
      }
    }
    if (DOM.brandTagline) DOM.brandTagline.textContent = CATALOG_CONFIG.storeTagline || "Componentes de PC & Tecnología";
    if (DOM.footerStoreName) DOM.footerStoreName.textContent = CATALOG_CONFIG.storeName || "Kleim Tech";
    if (DOM.footerCopyrightName) DOM.footerCopyrightName.textContent = CATALOG_CONFIG.storeName || "Kleim Tech";
    if (DOM.footerLocation && CATALOG_CONFIG.location) DOM.footerLocation.textContent = CATALOG_CONFIG.location;

    const contactUrl = CATALOG_CONFIG.contactUrl || `https://wa.me/${CATALOG_CONFIG.whatsappNumber}`;
    if (DOM.headerContactBtn) DOM.headerContactBtn.href = contactUrl;
    if (DOM.floatingWhatsappBtn) DOM.floatingWhatsappBtn.href = contactUrl;
    if (DOM.footerWhatsappLink) DOM.footerWhatsappLink.href = contactUrl;
    if (DOM.footerInstagramLink && CATALOG_CONFIG.instagramUrl) DOM.footerInstagramLink.href = CATALOG_CONFIG.instagramUrl;
    if (DOM.currentYear) DOM.currentYear.textContent = new Date().getFullYear();
  }

  function setupEventListeners() {
    if (DOM.mobileMenuBtn) {
      DOM.mobileMenuBtn.addEventListener("click", () => {
        DOM.mobileMenuBtn.classList.toggle("active");
        if (DOM.mainNav) DOM.mainNav.classList.toggle("nav-open");
      });
    }

    // Eventos para cerrar Modal
    if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener("click", closeProductModal);
    if (DOM.modalOverlay) DOM.modalOverlay.addEventListener("click", closeProductModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeProductModal();
    });

    if (DOM.clearActiveFilterBtn) DOM.clearActiveFilterBtn.addEventListener("click", window.appResetAllFilters);

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = state.searchQuery.length > 0 ? "flex" : "none";
        applyFilters();
      });
    }

    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener("click", () => {
        if (DOM.searchInput) {
          DOM.searchInput.value = "";
          state.searchQuery = "";
          DOM.searchClearBtn.style.display = "none";
          applyFilters();
        }
      });
    }

    if (DOM.hideOutOfStockToggle) {
      DOM.hideOutOfStockToggle.addEventListener("change", (e) => {
        state.hideOutOfStock = e.target.checked;
        applyFilters();
      });
    }

    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        applyFilters();
      });
    }

    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.addEventListener("click", window.appResetAllFilters);
  }

  function init() {
    initStoreInfo();
    applyFilters();
    setupEventListeners();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
