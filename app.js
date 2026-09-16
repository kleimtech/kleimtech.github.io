/**
 * LÓGICA PRINCIPAL DE LA APLICACIÓN - KLEIM TECH
 * Renderizado reactivo, Mega-Menu estilo Sigma Tiendas, filtrado por categoría/subcategoría,
 * cálculo dinámico de costo/stock y generación de pedidos por WhatsApp.
 */

// Función para procesar precio y stock antes de renderizar la tarjeta
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
    precioVenta: precioFinal.toFixed(2), // Formateado a 2 decimales (ej. 632.50)
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
    hideOutOfStock: false
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
    currentYear: document.getElementById("currentYear")
  };

  // Imagen placeholder SVG en caso de fallo de red en alguna imagen
  const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%20fill%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23111827%22%2F%3E%3Cpath%20d%3D%22M175%20130h50v40h-50z%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2265%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3EHardware%20PC%3C%2Ftext%3E%3C%2Fsvg%3E";

  /**
   * Normaliza textos eliminando acentos y espacios adicionales
   */
  function normalizeText(str) {
    if (!str) return "";
    return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

 /**
   * Normaliza el identificador de categoría para soportar tanto nombres completos
   * como variaciones o slugs cortos.
   */
  function normalizeCategory(cat) {
    if (!cat) return "";
    const lower = normalizeText(cat);
    
    // Categorías del nuevo esquema
    if (lower.includes("procesador") || lower === "cpu") return "procesadores";
    if (lower.includes("madre") || lower.includes("mother") || lower.includes("placa")) return "tarjetas madre";
    if (lower.includes("video") || lower.includes("grafica") || lower === "gpu") return "tarjetas de video";
    if (lower.includes("ram") || lower.includes("almacen") || lower.includes("disco") || lower.includes("ssd") || lower.includes("m.2")) return "almacenamiento y ram";
    if (lower.includes("componente") || lower.includes("fuente") || lower.includes("enfria") || lower.includes("chasis") || lower.includes("case")) return "componentes";
    if (lower.includes("equipo") || lower.includes("laptop") || lower.includes("mini pc") || lower.includes("tablet")) return "equipos";
    if (lower.includes("periferico") || lower.includes("monitor") || lower.includes("teclado") || lower.includes("audio") || lower.includes("redes")) return "perifericos";

    return lower;
  }

  /**
   * Formateador de precios en USD
   */
  function formatCurrency(amount) {
    const symbol = CATALOG_CONFIG.currencySymbol || "$";
    const currencyCode = CATALOG_CONFIG.currency || "USD";
    return `${symbol}${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="price-currency">${currencyCode}</span>`;
  }

  /**
   * Genera el enlace de WhatsApp con mensaje pre-cargado utilizando los datos calculados
   */
  function buildWhatsAppLink(product, datosCalculados) {
    const store = CATALOG_CONFIG.storeName || "Kleim Tech";
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

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${CATALOG_CONFIG.whatsappNumber}?text=${encodedText}`;
  }

  /**
   * Genera el HTML de una tarjeta de producto aplicando cálculo dinámico
   */
  function createProductCard(product) {
    const datos = obtenerDatosCalculados(product);
    const isAvailable = datos.disponible;
    const cardStatusClass = isAvailable ? "" : "out-of-stock";
    const waUrl = buildWhatsAppLink(product, datos);

    // Obtener nombre amigable de categoría
    const normCat = normalizeCategory(product.categoria);
    const catObj = (typeof CATEGORIAS !== "undefined" ? CATEGORIAS : []).find(c => c.id === normCat);
    const categoryDisplay = catObj ? catObj.nombre : product.categoria;
    const subcategoryDisplay = product.subcategoria ? ` &bull; ${product.subcategoria}` : "";

    // Badges
    const tagBadge = product.tag ? `<span class="badge-tag">${product.tag}</span>` : "";
    const categoryBadge = `<span class="badge-category">${categoryDisplay}${subcategoryDisplay}</span>`;
    const stockBadge = isAvailable
      ? `<span class="badge-stock available"><span class="stock-dot"></span>${datos.estadoTexto}</span>`
      : `<span class="badge-stock unavailable"><span class="stock-dot"></span>${datos.estadoTexto}</span>`;

    // Lista de especificaciones
    const specsHtml = (product.specs || [])
      .map(spec => `<li class="spec-item"><span class="spec-bullet">▸</span><span>${spec}</span></li>`)
      .join("");

    // Precio formateado o estado de stock
    const priceDisplayHtml = isAvailable
      ? `<div class="price-current">${formatCurrency(datos.precioVenta)}</div>`
      : `<div class="price-current" style="color: #94a3b8; font-size: 1.15rem; font-weight: 700; text-transform: uppercase;">${datos.estadoTexto}</div>`;

    // Botón de WhatsApp
    const buttonHtml = isAvailable
      ? `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp available" title="Comprar ${product.nombre} por WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.19 8.19 0 0 1-5.82 2.41c-1.47 0-2.92-.39-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.41c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.48-.73-1.71-.81-.23-.09-.39-.13-.56.13-.17.25-.65.81-.8 1-.15.19-.29.21-.54.08-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.18-.07-.11-.23-.17-.48-.3z"/></svg>
          <span>Comprar por WhatsApp</span>
        </a>`
      : `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp unavailable" title="Consultar disponibilidad por WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.19 8.19 0 0 1-5.82 2.41c-1.47 0-2.92-.39-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.41c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.48-.73-1.71-.81-.23-.09-.39-.13-.56.13-.17.25-.65.81-.8 1-.15.19-.29.21-.54.08-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.18-.07-.11-.23-.17-.48-.3z"/></svg>
          <span>Consultar reposición</span>
        </a>`;

    return `
      <article class="product-card ${cardStatusClass}" data-id="${product.id}" data-category="${product.categoria}" data-subcategory="${product.subcategoria || ''}">
        <div class="card-media">
          ${tagBadge}
          ${categoryBadge}
          <img 
            src="${product.imagen}" 
            alt="${product.nombre}" 
            class="card-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          >
          ${stockBadge}
        </div>
        <div class="card-content">
          <h2 class="card-title" title="${product.nombre}">${product.nombre}</h2>
          <ul class="card-specs">
            ${specsHtml}
          </ul>
          <div class="card-price-row">
            ${priceDisplayHtml}
          </div>
          ${buttonHtml}
        </div>
      </article>
    `;
  }

  /**
   * Actualiza la interfaz del badge de filtro activo
   */
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

    // Sincronizar clases activas en los enlaces del menú principal
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

/**
   * Filtra los productos según búsqueda, categoría, subcategoría y stock calculado
   */
  function applyFilters() {
    const rawSearch = state.searchQuery.trim().toLowerCase();
    const searchTerms = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : [];

    const productList = (typeof productos !== "undefined" ? productos : (typeof PRODUCTOS_DATA !== "undefined" ? PRODUCTOS_DATA : []));
    const totalAvailableInStore = productList.length;

    const filtered = productList.filter(item => {
      const datos = obtenerDatosCalculados(item);

      // 1. Filtro por stock disponible / agotado
      if (state.hideOutOfStock && !datos.disponible) {
        return false;
      }

      // 2. Filtro por categoría principal (Coincidencia normalizada)
      if (state.selectedCategory && state.selectedCategory !== "todos") {
        const normItemCat = normalizeCategory(item.categoria);
        const normSelectedCat = normalizeCategory(state.selectedCategory);
        if (normItemCat !== normSelectedCat) {
          return false;
        }
      }

      // 3. Filtro por subcategoría de forma estricta o flexible
      if (state.selectedSubcategory) {
        const normItemSub = normalizeText(item.subcategoria);
        const normSelectedSub = normalizeText(state.selectedSubcategory);

        const isSubMatch = normItemSub === normSelectedSub || 
                           normItemSub.includes(normSelectedSub) || 
                           normSelectedSub.includes(normItemSub);

        if (!isSubMatch) {
          return false;
        }
      }

      // 4. Filtro por texto de búsqueda (Nombre, Specs, Categoría, Subcategoría)
      if (searchTerms.length > 0) {
        const searchableText = `${item.nombre} ${(item.specs || []).join(" ")} ${item.categoria} ${item.subcategoria || ""} ${datos.estadoTexto}`.toLowerCase();
        const matchesAllTerms = searchTerms.every(term => searchableText.includes(term));
        if (!matchesAllTerms) {
          return false;
        }
      }

      return true;
    });

    updateActiveFilterUI();
    renderProducts(filtered, totalAvailableInStore);
  }

  /**
   * Renderiza el listado resultante en el DOM
   */
  function renderProducts(items, totalCount) {
    if (!DOM.productsGrid) return;

    if (items.length === 0) {
      DOM.productsGrid.innerHTML = "";
      DOM.emptyState.classList.add("visible");
      DOM.resultsCount.innerHTML = `Mostrando <strong>0</strong> productos`;
      return;
    }

    DOM.emptyState.classList.remove("visible");
    DOM.resultsCount.innerHTML = `Mostrando <strong>${items.length}</strong> de ${totalCount} productos`;

    const html = items.map(createProductCard).join("");
    DOM.productsGrid.innerHTML = html;
  }

  /**
   * Cierra el menú móvil
   */
  function closeMobileMenu() {
    if (DOM.mainNav) DOM.mainNav.classList.remove("active");
    if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.classList.remove("active");
    document.querySelectorAll(".header__nav-item.open").forEach(item => item.classList.remove("open"));
  }

  /**
   * Desplaza suavemente hacia los productos
   */
  function scrollToProducts() {
    const target = DOM.activeFilterBadge || DOM.productsGrid || DOM.resultsCount;
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  }

  /**
   * Filtra por categoría principal
   */
  window.appFilterCategory = function (categoryName) {
    state.selectedCategory = categoryName;
    state.selectedSubcategory = null;
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  /**
   * Filtra por categoría y subcategoría específica (ej. "Procesadores", "AMD")
   */
  window.appFilterSubcategory = function (categoryName, subcategoryName) {
    state.selectedCategory = categoryName;
    state.selectedSubcategory = subcategoryName;
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  /**
   * Restablece todos los filtros
   */
  window.appResetAllFilters = function () {
    state.selectedCategory = "todos";
    state.selectedSubcategory = null;
    state.searchQuery = "";
    if (DOM.searchInput) DOM.searchInput.value = "";
    if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = "none";
    closeMobileMenu();
    applyFilters();
    scrollToProducts();
  };

  /**
   * Configura la información visual del negocio desde CATALOG_CONFIG
   */
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

    if (DOM.footerInstagramLink && CATALOG_CONFIG.instagramUrl) {
      DOM.footerInstagramLink.href = CATALOG_CONFIG.instagramUrl;
    }

    if (DOM.currentYear) {
      DOM.currentYear.textContent = new Date().getFullYear();
    }
  }

  /**
   * Vincula eventos de la interfaz
   */
  function setupEventListeners() {
    // Menú hamburguesa móvil
if (DOM.mobileMenuBtn) {
    // CAMBIO AQUÍ: Añadido soporte explícito para toques con el dedo ('touchstart')
    ['click', 'touchstart'].forEach(eventType => {
        DOM.mobileMenuBtn.addEventListener(eventType, function(e) {
            e.preventDefault(); // Evita que Android ejecute la acción dos veces por error
            DOM.mobileMenuBtn.classList.toggle("active");
            if (DOM.mainNav) DOM.mainNav.classList.toggle("active"); // CAMBIO: "active"
        }, { passive: false });
    });
}

    // Acordeón para submenús en dispositivos móviles
    document.querySelectorAll(".header__nav-item.has-dropdown > .header__nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const parent = link.closest(".header__nav-item");
          if (parent) {
            // Cerrar otros abiertos
            document.querySelectorAll(".header__nav-item.open").forEach(item => {
              if (item !== parent) item.classList.remove("open");
            });
            parent.classList.toggle("open");
          }
        }
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 992 && DOM.mainNav && DOM.mainNav.classList.contains("nav-open")) {
        const isClickInsideNav = DOM.mainNav.contains(e.target);
        const isClickOnToggle = DOM.mobileMenuBtn && DOM.mobileMenuBtn.contains(e.target);
        if (!isClickInsideNav && !isClickOnToggle) {
          closeMobileMenu();
        }
      }
    });

    // Botón de limpiar filtro activo
    if (DOM.clearActiveFilterBtn) {
      DOM.clearActiveFilterBtn.addEventListener("click", () => {
        window.appResetAllFilters();
      });
    }

    // Input de búsqueda en tiempo real (con debounce ligero)
    let searchTimeout = null;
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        state.searchQuery = val;

        // Mostrar u ocultar botón de limpiar
        if (DOM.searchClearBtn) {
          DOM.searchClearBtn.style.display = val.length > 0 ? "flex" : "none";
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          applyFilters();
        }, 120);
      });
    }

    // Botón para limpiar búsqueda
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener("click", () => {
        if (DOM.searchInput) {
          DOM.searchInput.value = "";
          state.searchQuery = "";
          DOM.searchClearBtn.style.display = "none";
          DOM.searchInput.focus();
          applyFilters();
        }
      });
    }

    // Toggle para ocultar productos sin stock
    if (DOM.hideOutOfStockToggle) {
      DOM.hideOutOfStockToggle.addEventListener("change", (e) => {
        state.hideOutOfStock = e.target.checked;
        applyFilters();
      });
    }

    // Botón de restablecer filtros en estado vacío
    if (DOM.resetFiltersBtn) {
      DOM.resetFiltersBtn.addEventListener("click", () => {
        window.appResetAllFilters();
      });
    }
  }

  /**
   * Inicialización de la aplicación
   */
  function init() {
    initStoreInfo();
    applyFilters();
    setupEventListeners();
  }

  // Ejecución cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
