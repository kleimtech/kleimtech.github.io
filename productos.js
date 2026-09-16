/**
 * CONFIGURACIÓN GENERAL DEL CATÁLOGO - KLEIM TECH
 * Edita estos valores para personalizar tu tienda.
 */
const CATALOG_CONFIG = {
  storeName: "Kleim Tech",
  storeTagline: "Componentes de PC & Tecnología",
  // Número de WhatsApp con código de país (sin '+', sin espacios ni guiones)
  whatsappNumber: "584162923274",
  currency: "USD",
  currencySymbol: "$",
  // Métodos de pago visibles en la barra superior
  paymentNotice: "💳 Aceptamos Zelle, USDT (Binance Pay), Pago Móvil y Efectivo | Precios en USD",
  contactUrl: "https://wa.me/584162923274?text=Hola%20Kleim%20Tech%2C%20quisiera%20hacer%20una%20consulta%20sobre%20sus%20productos",
  instagramUrl: "https://instagram.com/kleimtech",
  location: "Venezuela 🇻🇪 - Envíos a nivel nacional y entregas personales"
};

/**
 * MARGEN DE GANANCIA POR DEFECTO
 * Se aplica automáticamente a todos los productos que no especifiquen una 'ganancia' individual.
 */
const MARGEN_GANANCIA_GENERAL = 15; // Porcentaje de ganancia deseado (ej. 15%)

/**
 * TAXONOMÍA OFICIAL: 7 CATEGORÍAS PRINCIPALES Y SUS SUBCATEGORÍAS
 */
const TAXONOMIA_CATEGORIAS = [
  {
    categoria: "Procesadores",
    subcategorias: ["Intel", "AMD"]
  },
  {
    categoria: "Tarjetas Madre",
    subcategorias: ["Intel", "AMD"]
  },
  {
    categoria: "Tarjetas de Video",
    subcategorias: ["NVIDIA", "AMD Radeon", "Intel Arc"]
  },
  {
    categoria: "Almacenamiento y RAM",
    subcategorias: ["RAM PC", "RAM Laptop", "Disco M.2 NVMe", "SSD SATA / HDD"]
  },
  {
    categoria: "Componentes",
    subcategorias: ["Fuentes de Poder", "Enfriamiento", "Chasis / Cases"]
  },
  {
    categoria: "Equipos",
    subcategorias: ["Laptops", "CPUs Ensamblados", "Mini PC", "Tablets"]
  },
  {
    categoria: "Periféricos",
    subcategorias: ["Monitores", "Teclados y Mouses", "Audio y Video", "Redes y Energía"]
  }
];

/**
 * BASE DE DATOS DE PRODUCTOS CON TAXONOMÍA EXACTA
 * -------------------------------------------------------------
 * Cada producto cuenta con:
 * - id: Identificador único
 * - nombre: Nombre comercial completo
 * - categoria: Una de las 7 categorías oficiales
 * - subcategoria: Una de las subcategorías correspondientes
 * - costo: Costo real del proveedor (si costo <= 0 calcula $0.00 y se marca "Agotado")
 * - ganancia: % de ganancia para este producto (opcional, por defecto MARGEN_GANANCIA_GENERAL)
 * - imagen: URL de la imagen
 * - specs: Lista de especificaciones clave
 * - tag: Etiqueta promocional opcional
 */
const productos = [
  // ================= 1. PROCESADORES =================
  {
    id: "cpu-intel-i7-14700k",
    nombre: "Intel Core i7-14700K 14va Gen LGA 1700",
    categoria: "Procesadores",
    subcategoria: "Intel",
    costo: 430.00,
    ganancia: 15,
    specs: ["20 Núcleos (8P + 12E)", "Hasta 5.6 GHz", "Intel UHD Graphics 770", "Socket LGA 1700"],
    imagen: "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80",
    tag: "14va Gen"
  },
  {
    id: "cpu-intel-i5-14600kf",
    nombre: "Intel Core i5-14600KF 14va Gen",
    categoria: "Procesadores",
    subcategoria: "Intel",
    costo: 260.00,
    ganancia: 15,
    specs: ["14 Núcleos (6P + 8E)", "Hasta 5.3 GHz", "Socket LGA 1700", "Desbloqueado para Overclock"],
    imagen: "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "cpu-intel-i3-12100f",
    nombre: "Intel Core i3-12100F Socket LGA 1700",
    categoria: "Procesadores",
    subcategoria: "Intel",
    costo: 0, // Costo 0 -> Agotado
    ganancia: 15,
    specs: ["4 Núcleos / 8 Hilos", "Hasta 4.3 GHz", "Socket LGA 1700", "Gama Entrada"],
    imagen: "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "cpu-ryzen-7-7800x3d",
    nombre: "AMD Ryzen 7 7800X3D Socket AM5",
    categoria: "Procesadores",
    subcategoria: "AMD",
    costo: 390.00,
    ganancia: 15,
    specs: ["8 Núcleos / 16 Hilos", "Hasta 5.0 GHz", "96MB 3D V-Cache", "Socket AM5 (DDR5/PCIe 5.0)"],
    imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    tag: "Top Gaming"
  },
  {
    id: "cpu-ryzen-5-7600x",
    nombre: "AMD Ryzen 5 7600X Socket AM5",
    categoria: "Procesadores",
    subcategoria: "AMD",
    costo: 195.00,
    ganancia: 15,
    specs: ["6 Núcleos / 12 Hilos", "Hasta 5.3 GHz", "38MB Cache", "Socket AM5 Ready"],
    imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "cpu-ryzen-7-5700g",
    nombre: "AMD Ryzen 7 5700G AM4 con Gráficos Vega 8",
    categoria: "Procesadores",
    subcategoria: "AMD",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Socket AM4", "Gráficos Vega 8 integrados", "8 Núcleos / 16 Hilos", "Hasta 4.6 GHz"],
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 2. TARJETAS MADRE =================
  {
    id: "mb-asus-tuf-z790",
    nombre: "ASUS TUF Gaming Z790-Plus WiFi DDR5",
    categoria: "Tarjetas Madre",
    subcategoria: "Intel",
    costo: 216.00,
    ganancia: 15,
    specs: ["Socket LGA 1700 para Intel 12/13/14 Gen", "4x M.2 NVMe PCIe 4.0", "WiFi 6E + Bluetooth 5.3", "VRM 16+1 fases"],
    imagen: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    tag: "WiFi 6E"
  },
  {
    id: "mb-msi-b760m-a",
    nombre: "MSI PRO B760M-A WiFi DDR5 LGA 1700",
    categoria: "Tarjetas Madre",
    subcategoria: "Intel",
    costo: 139.00,
    ganancia: 15,
    specs: ["Socket LGA 1700 Micro-ATX", "Doble M.2 Shield Frozr", "2.5G LAN + WiFi 6E", "Soporte DDR5 hasta 7000+ MHz"],
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "mb-gigabyte-h610m",
    nombre: "Gigabyte H610M S2H DDR4 LGA 1700",
    categoria: "Tarjetas Madre",
    subcategoria: "Intel",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Socket LGA 1700", "2 slots DDR4", "NVMe PCIe 3.0 x4", "Salidas HDMI, DVI, VGA"],
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "mb-gigabyte-b650-aorus",
    nombre: "Gigabyte B650 AORUS Elite AX V2 Socket AM5",
    categoria: "Tarjetas Madre",
    subcategoria: "AMD",
    costo: 190.00,
    ganancia: 15,
    specs: ["Socket AM5 para Ryzen 7000/8000/9000", "WiFi 6E + 2.5GbE LAN", "3x M.2 PCIe 5.0/4.0", "VRM digital 12+2+2 fases"],
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    tag: "Recomendado"
  },
  {
    id: "mb-asus-rog-b650e-f",
    nombre: "ASUS ROG Strix B650E-F Gaming WiFi AM5",
    categoria: "Tarjetas Madre",
    subcategoria: "AMD",
    costo: 245.00,
    ganancia: 15,
    specs: ["PCIe 5.0 x16 y M.2 PCIe 5.0", "Socket AM5 DDR5", "WiFi 6E y audio SupremeFX ALC4080", "Disipadores térmicos masivos"],
    imagen: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    tag: "ROG Gamer"
  },
  {
    id: "mb-msi-b550m-pro",
    nombre: "MSI B550M PRO-VDH WiFi Socket AM4",
    categoria: "Tarjetas Madre",
    subcategoria: "AMD",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Socket AM4 Micro-ATX", "Dual M.2 con Shield Frozr", "DisplayPort, HDMI & VGA", "WiFi integrado"],
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 3. TARJETAS DE VIDEO =================
  {
    id: "gpu-rtx-4070-super",
    nombre: "NVIDIA GeForce RTX 4070 Super 12GB Dual Fan",
    categoria: "Tarjetas de Video",
    subcategoria: "NVIDIA",
    costo: 550.00,
    ganancia: 15,
    specs: ["12GB GDDR6X 192-bit", "Arquitectura Ada Lovelace / DLSS 3.5", "Ray Tracing Gen 3", "3x DisplayPort 1.4a, 1x HDMI 2.1a"],
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    tag: "Oferta"
  },
  {
    id: "gpu-rtx-4060-ti",
    nombre: "NVIDIA GeForce RTX 4060 Ti 8GB Twin Edge",
    categoria: "Tarjetas de Video",
    subcategoria: "NVIDIA",
    costo: 360.00,
    ganancia: 15,
    specs: ["8GB GDDR6", "DLSS 3 con Frame Generation", "Ray Tracing", "Consumo ultra eficiente 160W"],
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "gpu-rtx-3060-12gb",
    nombre: "NVIDIA GeForce RTX 3060 12GB OC Edition",
    categoria: "Tarjetas de Video",
    subcategoria: "NVIDIA",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["12GB GDDR6", "DLSS 2 / Ray Tracing", "Refrigeración silenciosa", "Ideal para 1080p competitivo"],
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "gpu-rx-7800-xt",
    nombre: "AMD Radeon RX 7800 XT 16GB Triple Fan",
    categoria: "Tarjetas de Video",
    subcategoria: "AMD Radeon",
    costo: 460.00,
    ganancia: 15,
    specs: ["16GB GDDR6 256-bit", "Arquitectura RDNA 3 / FSR 3", "Enfriamiento Triple Fan", "Resolución 1440p / 4K Ultra"],
    imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    tag: "16GB VRAM"
  },
  {
    id: "gpu-rx-7600-8gb",
    nombre: "AMD Radeon RX 7600 8GB OC Edition",
    categoria: "Tarjetas de Video",
    subcategoria: "AMD Radeon",
    costo: 245.00,
    ganancia: 15,
    specs: ["8GB GDDR6", "Arquitectura RDNA 3", "HDMI 2.1 / DisplayPort 2.1", "1080p Ultra Gaming"],
    imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "gpu-intel-arc-a770",
    nombre: "Intel Arc A770 16GB GDDR6 Edición Especial",
    categoria: "Tarjetas de Video",
    subcategoria: "Intel Arc",
    costo: 285.00,
    ganancia: 15,
    specs: ["16GB GDDR6 256-bit", "Intel XeSS AI Upscaling", "Aceleración de Ray Tracing", "Codificación nativa AV1 por hardware"],
    imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    tag: "AV1 Creator"
  },
  {
    id: "gpu-intel-arc-a580",
    nombre: "Intel Arc A580 8GB GDDR6 Dual Fan",
    categoria: "Tarjetas de Video",
    subcategoria: "Intel Arc",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["8GB GDDR6", "Xe Super Sampling", "DirectX 12 Ultimate", "Doble ventilador silencioso"],
    imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 4. ALMACENAMIENTO Y RAM =================
  {
    id: "ram-corsair-ddr5-32gb",
    nombre: "Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz",
    categoria: "Almacenamiento y RAM",
    subcategoria: "RAM PC",
    costo: 108.00,
    ganancia: 15,
    specs: ["32GB Kit (2x16GB)", "6000 MT/s CL30", "Soporte Intel XMP 3.0 y AMD EXPO", "Iluminación RGB dinámica"],
    imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80",
    tag: "RGB"
  },
  {
    id: "ram-kingston-fury-ddr4-16gb",
    nombre: "Kingston FURY Beast DDR4 16GB (2x8GB) 3200MHz",
    categoria: "Almacenamiento y RAM",
    subcategoria: "RAM PC",
    costo: 39.00,
    ganancia: 15,
    specs: ["16GB Dual Channel", "3200MHz CL16", "Disipador de perfil bajo negro", "Plug and Play"],
    imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "ram-crucial-laptop-ddr5-16gb",
    nombre: "Crucial RAM 16GB DDR5 4800MHz SO-DIMM Laptop",
    categoria: "Almacenamiento y RAM",
    subcategoria: "RAM Laptop",
    costo: 45.00,
    ganancia: 15,
    specs: ["Formato SO-DIMM 262-pin", "Velocidad 4800 MT/s", "Bajo voltaje 1.1V", "Compatible con Intel 12-14va y AMD Ryzen 6000+"],
    imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "ram-fury-impact-ddr4-16gb",
    nombre: "Kingston FURY Impact 16GB DDR4 3200MHz SO-DIMM",
    categoria: "Almacenamiento y RAM",
    subcategoria: "RAM Laptop",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["16GB SO-DIMM", "3200MHz CL20", "Overclocking automático Plug N Play", "Ideal para upgrade de portátiles"],
    imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "ssd-samsung-990-pro-2tb",
    nombre: "Samsung 990 PRO NVMe M.2 SSD 2TB PCIe 4.0",
    categoria: "Almacenamiento y RAM",
    subcategoria: "Disco M.2 NVMe",
    costo: 156.00,
    ganancia: 15,
    specs: ["PCIe Gen 4.0 x4", "Lectura secuencial: 7450 MB/s", "Escritura: 6900 MB/s", "Disipación inteligente de calor"],
    imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    tag: "Ultrarrápido"
  },
  {
    id: "ssd-kingston-nv2-1tb",
    nombre: "Kingston NV2 NVMe M.2 1TB PCIe 4.0",
    categoria: "Almacenamiento y RAM",
    subcategoria: "Disco M.2 NVMe",
    costo: 53.00,
    ganancia: 15,
    specs: ["Capacidad 1000GB (1TB)", "Lecturas hasta 3500 MB/s", "Formato compacto M.2 2280", "Bajo consumo"],
    imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "ssd-kingston-a400-480gb",
    nombre: "Kingston A400 SSD 480GB SATA 2.5\"",
    categoria: "Almacenamiento y RAM",
    subcategoria: "SSD SATA / HDD",
    costo: 28.00,
    ganancia: 15,
    specs: ["Formato 2.5 pulgadas SATA 6Gb/s", "Lectura hasta 500MB/s", "10x más rápido que disco mecánico", "Resistente a vibraciones"],
    imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "hdd-seagate-barracuda-2tb",
    nombre: "Seagate BarraCuda 2TB 3.5\" SATA 7200 RPM",
    categoria: "Almacenamiento y RAM",
    subcategoria: "SSD SATA / HDD",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["2TB de almacenamiento masivo", "7200 RPM", "256MB Caché", "Para backups y librerías de juegos"],
    imagen: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 5. COMPONENTES =================
  {
    id: "psu-corsair-rm850e",
    nombre: "Corsair RM850e 850W 80 Plus Gold Modular ATX 3.0",
    categoria: "Componentes",
    subcategoria: "Fuentes de Poder",
    costo: 112.00,
    ganancia: 15,
    specs: ["Certificación 80 PLUS Gold", "Compatible con PCIe 5.0 y ATX 3.0", "Cables totalmente modulares", "Ventilador silencioso 120mm"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    tag: "ATX 3.0"
  },
  {
    id: "psu-evga-600-w1",
    nombre: "EVGA 600W 80 Plus White",
    categoria: "Componentes",
    subcategoria: "Fuentes de Poder",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Potencia continua de 600W", "Certificación 80 PLUS", "Protecciones OVP, UVP, OCP, OPP, SCP", "Ventilador automático"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "cool-deepcool-ls720",
    nombre: "Refrigeración Líquida DeepCool LS720 SE 360mm ARGB",
    categoria: "Componentes",
    subcategoria: "Enfriamiento",
    costo: 98.00,
    ganancia: 15,
    specs: ["Radiador de 360mm de aluminio", "Bomba de alto flujo de 4ta generación", "3 ventiladores ARGB silenciosos", "Compatible con LGA1700 y AM5"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    tag: "360mm AIO"
  },
  {
    id: "cool-thermalright-pa120",
    nombre: "Disipador Thermalright Peerless Assassin 120 SE",
    categoria: "Componentes",
    subcategoria: "Enfriamiento",
    costo: 35.00,
    ganancia: 15,
    specs: ["Doble torre con 6 heatpipes de cobre", "2 ventiladores PWM de 120mm", "Disipación masiva hasta 245W TDP", "Compatible con sockets AM4, AM5, LGA1700"],
    imagen: "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "case-nzxt-h5-flow",
    nombre: "Case Gamer NZXT H5 Flow RGB Cristal Templado",
    categoria: "Componentes",
    subcategoria: "Chasis / Cases",
    costo: 82.00,
    ganancia: 15,
    specs: ["Panel frontal perforado ultra flujo de aire", "2 ventiladores F140 RGB preinstalados", "Ventilador dedicado para GPU", "Soporte para radiadores 280mm"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "case-corsair-4000d",
    nombre: "Gabinete Corsair 4000D Airflow Black Mid-Tower",
    categoria: "Componentes",
    subcategoria: "Chasis / Cases",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Sistema de gestión de cables RapidRoute", "Frontal de acero optimizado para flujo", "Panel lateral de vidrio templado", "2 ventiladores AirGuide 120mm"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 6. EQUIPOS =================
  {
    id: "laptop-asus-tuf-a15",
    nombre: "Laptop Gamer ASUS TUF Gaming A15 15.6\" 144Hz RTX 4060",
    categoria: "Equipos",
    subcategoria: "Laptops",
    costo: 890.00,
    ganancia: 15,
    specs: ["AMD Ryzen 7 7735HS 8C/16T", "NVIDIA GeForce RTX 4060 8GB (140W)", "16GB RAM DDR5 4800MHz", "512GB SSD NVMe Gen4"],
    imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    tag: "Gamer RTX"
  },
  {
    id: "laptop-hp-pavilion-aero",
    nombre: "HP Pavilion Aero 13.3\" WQXGA Ultrabook Ultraliviana",
    categoria: "Equipos",
    subcategoria: "Laptops",
    costo: 590.00,
    ganancia: 15,
    specs: ["AMD Ryzen 7 7735U", "16GB LPDDR5", "512GB SSD NVMe", "Peso menor a 1 Kg chasis de magnesio"],
    imagen: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "pc-kleimtech-beast-am5",
    nombre: "PC Gamer Kleim Tech Beast: Ryzen 7 7800X3D + RTX 4070 Super",
    categoria: "Equipos",
    subcategoria: "CPUs Ensamblados",
    costo: 1280.00,
    ganancia: 15,
    specs: ["AMD Ryzen 7 7800X3D 8C/16T", "GeForce RTX 4070 Super 12GB Dual", "32GB DDR5 6000MHz RGB", "SSD NVMe 2TB + Fuente 850W Gold"],
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    tag: "PC Armada"
  },
  {
    id: "pc-kleimtech-budget-i5",
    nombre: "PC Ensamblado Entrada: Intel Core i5-12400F + RTX 3050",
    categoria: "Equipos",
    subcategoria: "CPUs Ensamblados",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Intel Core i5-12400F", "16GB RAM DDR4 3200MHz", "SSD 500GB NVMe M.2", "Gabinete con 4 ventiladores RGB"],
    imagen: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "mini-pc-beelink-ser5",
    nombre: "Mini PC Beelink SER5 Max AMD Ryzen 7 5800H",
    categoria: "Equipos",
    subcategoria: "Mini PC",
    costo: 310.00,
    ganancia: 15,
    specs: ["AMD Ryzen 7 5800H 8C/16T", "16GB RAM DDR4 (Expandible)", "500GB NVMe M.2 SSD", "Soporte triple pantalla 4K 60Hz"],
    imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    tag: "Mini PC"
  },
  {
    id: "tab-xiaomi-pad-6",
    nombre: "Tablet Xiaomi Pad 6 11\" 144Hz WQHD+ 128GB",
    categoria: "Equipos",
    subcategoria: "Tablets",
    costo: 275.00,
    ganancia: 15,
    specs: ["Pantalla 11 pulgadas 144Hz WQHD+", "Procesador Snapdragon 870", "Batería masiva 8840 mAh con carga 33W", "Cuatro altavoces Dolby Atmos"],
    imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "tab-samsung-s9-fe",
    nombre: "Tablet Samsung Galaxy Tab S9 FE 10.9\" con S-Pen",
    categoria: "Equipos",
    subcategoria: "Tablets",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Pantalla 10.9\" 90Hz", "Lápiz óptico S-Pen incluido", "Resistencia al agua y polvo IP68", "Cámara 8MP + 12MP Ultra Wide"],
    imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },

  // ================= 7. PERIFÉRICOS =================
  {
    id: "mon-lg-ultragear-27",
    nombre: "Monitor LG UltraGear 27\" IPS QHD 165Hz 1ms",
    categoria: "Periféricos",
    subcategoria: "Monitores",
    costo: 260.00,
    ganancia: 15,
    specs: ["Resolución 2560x1440 (2K QHD)", "Panel Nano IPS 1ms GtG", "165Hz con G-Sync y FreeSync", "HDR400 con cobertura DCI-P3 98%"],
    imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    tag: "165Hz 2K"
  },
  {
    id: "mon-samsung-odyssey-g3",
    nombre: "Monitor Samsung Odyssey G3 24\" FHD 144Hz 1ms",
    categoria: "Periféricos",
    subcategoria: "Monitores",
    costo: 129.00,
    ganancia: 15,
    specs: ["Pantalla 24 pulgadas Full HD 1080p", "Tasa de refresco fluida de 144Hz", "Tiempo de respuesta 1ms MPRT", "Base ergonómica regulable"],
    imagen: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "per-logitech-g502",
    nombre: "Mouse Gamer Logitech G502 HERO 25K DPI",
    categoria: "Periféricos",
    subcategoria: "Teclados y Mouses",
    costo: 41.00,
    ganancia: 15,
    specs: ["Sensor HERO 25K DPI", "11 botones programables", "Pesas ajustables personalizables", "RGB LIGHTSYNC"],
    imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller"
  },
  {
    id: "per-redragon-kumara",
    nombre: "Teclado Mecánico Redragon Kumara K552 RGB TKL",
    categoria: "Periféricos",
    subcategoria: "Teclados y Mouses",
    costo: 34.00,
    ganancia: 15,
    specs: ["Formato compacto Tenkeyless (TKL)", "Switches mecánicos Outemu Red", "Iluminación RGB configurable", "Chasis metálico resistente"],
    imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "per-hyperx-cloud2",
    nombre: "Auriculares HyperX Cloud II Gaming 7.1 Surround",
    categoria: "Periféricos",
    subcategoria: "Audio y Video",
    costo: 68.00,
    ganancia: 15,
    specs: ["Sonido envolvente virtual 7.1", "Almohadillas de espuma viscoelástica", "Micrófono desmontable con cancelación de ruido", "Marco de aluminio durable"],
    imagen: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "per-webcam-logitech-c920",
    nombre: "Cámara Web Logitech C920 HD Pro 1080p con Micrófono Estéreo",
    categoria: "Periféricos",
    subcategoria: "Audio y Video",
    costo: 0, // Sin stock
    ganancia: 15,
    specs: ["Grabación y streaming Full HD 1080p a 30fps", "Lente de cristal Full HD", "Corrección automática de iluminación", "Doble micrófono estéreo"],
    imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    tag: "Agotado"
  },
  {
    id: "net-router-tplink-ax12",
    nombre: "Router WiFi 6 Gigabit TP-Link Archer AX12 Dual Band",
    categoria: "Periféricos",
    subcategoria: "Redes y Energía",
    costo: 48.00,
    ganancia: 15,
    specs: ["Tecnología Wi-Fi 6 de última generación", "Velocidades hasta 1.5 Gbps (1201 Mbps en 5 GHz + 300 Mbps en 2.4 GHz)", "4 antenas de alta ganancia", "Tecnología Beamforming y OFDMA"],
    imagen: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "pwr-ups-forza-750va",
    nombre: "UPS Interactivo Forza NT-751 750VA / 375W con Regulador",
    categoria: "Periféricos",
    subcategoria: "Redes y Energía",
    costo: 42.00,
    ganancia: 15,
    specs: ["Capacidad 750VA / 375W", "Regulación automática de voltaje (AVR)", "Protección contra sobretensiones y descargas", "Autonomía de respaldo en cortes eléctricos"],
    imagen: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80"
  }
];

// Alias para compatibilidad con código existente
const PRODUCTOS_DATA = productos;
const CATEGORIAS = TAXONOMIA_CATEGORIAS.map(t => ({ id: t.categoria.toLowerCase(), nombre: t.categoria }));
