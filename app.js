const STORAGE_KEY = "home-inventory-pwa-v1";
const SYNC_CONFIG = window.HOME_INVENTORY_SYNC || null;

const DEFAULT_CATEGORIES = [
  { name: "全部", color: "#0f766e" },
  { name: "日用", color: "#3973b8" },
  { name: "洗漱", color: "#0f766e" },
  { name: "衣物", color: "#8b5cf6" },
  { name: "工具", color: "#c44949" },
  { name: "清洁", color: "#9c5f05" },
  { name: "电子", color: "#2f855a" },
  { name: "文件", color: "#4b5563" }
];

const DEFAULT_LOCATIONS = [
  "床下-A箱",
  "床下-B箱",
  "衣柜-上层",
  "衣柜-挂衣区",
  "桌面-左抽屉",
  "阳台-收纳架2层",
  "卫生间-镜柜",
  "临时-待整理"
];

const DEFAULT_ZONES = ["床下", "衣柜", "桌面", "阳台", "卫生间", "厨房", "临时", "其他"];

const DEFAULT_CONTAINERS = [
  {
    id: "wardrobe",
    name: "衣柜",
    type: "wardrobe",
    locations: ["衣柜-上层", "衣柜-挂衣区"],
    position: { x: 34, y: 38, z: 1 },
    size: { w: 2.1, h: 3.2, d: 1.3 },
    color: "#b9885a",
    accent: "#8e6337",
    description: "衣物和挂衣区"
  },
  {
    id: "underbed",
    name: "床下收纳盒",
    type: "box",
    locations: ["床下-A箱", "床下-B箱"],
    position: { x: 36, y: 72, z: 2 },
    size: { w: 2.7, h: 0.9, d: 1.4 },
    color: "#7b8fa1",
    accent: "#4f6578",
    description: "被褥、备件和不常用杂物"
  },
  {
    id: "nightstand",
    name: "床头柜",
    type: "drawer",
    locations: ["床头柜-抽屉"],
    position: { x: 64, y: 58, z: 3 },
    size: { w: 1.45, h: 1.35, d: 1.25 },
    color: "#9f7b59",
    accent: "#6a4a31",
    description: "睡前常用、小件杂物"
  },
  {
    id: "desk-drawer",
    name: "桌面抽屉",
    type: "drawer",
    locations: ["桌面-左抽屉"],
    position: { x: 71, y: 38, z: 4 },
    size: { w: 1.8, h: 1.15, d: 1.2 },
    color: "#7d8f9d",
    accent: "#526777",
    description: "常用工具和办公小物"
  },
  {
    id: "balcony-rack",
    name: "阳台架",
    type: "shelf",
    locations: ["阳台-收纳架2层"],
    position: { x: 52, y: 28, z: 5 },
    size: { w: 2.2, h: 2.7, d: 0.85 },
    color: "#8a9b69",
    accent: "#607043",
    description: "清洁用品和大包装"
  },
  {
    id: "bathroom-cabinet",
    name: "镜柜",
    type: "cabinet",
    locations: ["卫生间-镜柜"],
    position: { x: 78, y: 70, z: 6 },
    size: { w: 1.5, h: 1.8, d: 0.8 },
    color: "#8ca1b5",
    accent: "#5f7487",
    description: "洗漱用品"
  },
  {
    id: "temporary",
    name: "临时区",
    type: "crate",
    locations: ["临时-待整理"],
    position: { x: 22, y: 60, z: 7 },
    size: { w: 1.6, h: 1.05, d: 1.1 },
    color: "#bc906c",
    accent: "#8d6341",
    description: "待整理、待归位"
  }
];

const SAMPLE_ITEMS = [
  { name: "纸巾", category: "日用", location: "床下-A箱", quantity: 2, unit: "包", trackStock: true, minQuantity: 2, note: "" },
  { name: "牙膏", category: "洗漱", location: "卫生间-镜柜", quantity: 1, unit: "支", trackStock: true, minQuantity: 1, note: "" },
  { name: "螺丝刀套装", category: "工具", location: "桌面-左抽屉", quantity: 1, unit: "套", trackStock: false, minQuantity: 0, note: "" },
  { name: "备用电池", category: "电子", location: "床下-B箱", quantity: 6, unit: "节", trackStock: true, minQuantity: 4, note: "5号" }
];

const state = {
  data: loadData(),
  view: "items",
  spaceMode: "list",
  containerMode: "grid",
  locationFilter: "all",
  search: "",
  category: "全部",
  selectedLocation: "",
  selectedZone: "",
  selectedItemId: "",
  syncClient: null,
  saving: false,
  space: null
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindElements();
  bindEvents();
  populateSettings();
  populateFormOptions();
  render();
  registerServiceWorker();
  initSync();
}

function bindElements() {
  [
    "syncButton", "searchInput", "itemCount", "locationCount", "lowCount",
    "categoryFilters", "itemList", "emptyItems", "sampleButton",
    "locationGrid", "locationFilters", "emptyLocations", "addLocationButton",
    "zoneGrid", "emptyZones", "addZoneButton", "replenishList", "replenishHint",
    "emptyReplenish", "householdName", "memberName", "saveSettingsButton",
    "syncStatusCard", "syncStatusText", "syncStatusDetail", "exportButton",
    "importInput", "clearButton", "addItemButton", "itemModal", "itemForm",
    "itemModalTitle", "itemId", "itemName", "itemCategory", "itemCategoryOptions",
    "itemZone", "itemZoneOptions", "itemLocation", "itemLocationOptions",
    "itemQuantity", "itemUnit", "trackStock", "minStockWrap",
    "itemMinQuantity", "itemNote", "itemBrand", "itemSpec", "itemPurchaseDate",
    "itemExpiryDate", "itemThumbnail", "deleteItemButton", "locationModal",
    "locationForm", "locationModalTitle", "locationOriginalName", "locationName",
    "locationZone", "locationNote", "locationImageFile", "locationImage",
    "locationImagePreview", "clearLocationImageButton", "deleteLocationButton", "toast", "spaceCanvas", "spaceStage",
    "zoneModal", "zoneForm", "zoneModalTitle", "zoneOriginalName", "zoneName",
    "zoneImageFile", "zoneImage", "zoneImagePreview", "clearZoneImageButton",
    "zoneDetailModal", "zoneDetailTitle", "zoneDetailMeta", "zoneDetailList",
    "selectedContainerName", "selectedContainerMeta", "searchResults",
    "detailModal", "detailTitle", "detailThumb", "detailCategory",
    "detailQuantity", "detailLocation", "detailGrid", "detailNote",
    "openContainerButton", "editFromDetailButton", "containerModal",
    "containerTitle", "containerMeta", "containerItemsGrid",
    "containerItemsTableWrap", "containerItemsTableBody", "containerAddItemButton",
    "sceneTip", "listMode",
    "addContainerButton", "containerFormModal", "containerForm", "newContainerName",
    "newContainerType", "newContainerLocation", "newContainerDescription",
    "newContainerZone", "containerCount",
    "zoneDetailAddLocationButton"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeDialogs());
  });

  document.addEventListener("toggle", handleMenuToggle, true);
  document.addEventListener("click", handleDocumentClick);

  document.querySelectorAll("[data-space-mode]").forEach((button) => {
    button.addEventListener("click", () => switchSpaceMode(button.dataset.spaceMode));
  });

  document.querySelectorAll("[data-container-mode]").forEach((button) => {
    button.addEventListener("click", () => switchContainerMode(button.dataset.containerMode));
  });

  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  els.addItemButton.addEventListener("click", () => openItemModal());
  els.sampleButton.addEventListener("click", importSamples);
  els.addLocationButton.addEventListener("click", () => openLocationModal());
  els.addZoneButton.addEventListener("click", () => openZoneModal());
  els.itemForm.addEventListener("submit", saveItemFromForm);
  els.locationForm.addEventListener("submit", saveLocationFromForm);
  els.zoneForm.addEventListener("submit", saveZoneFromForm);
  els.deleteLocationButton.addEventListener("click", deleteCurrentLocation);
  els.trackStock.addEventListener("change", updateMinStockVisibility);
  els.itemZone?.addEventListener("input", () => refreshItemLocationOptions());
  els.itemZone?.addEventListener("change", () => refreshItemLocationOptions());
  els.locationImageFile?.addEventListener("change", (event) => handleImageUpload(event, "location"));
  els.zoneImageFile?.addEventListener("change", (event) => handleImageUpload(event, "zone"));
  els.clearLocationImageButton?.addEventListener("click", () => clearImageField("location"));
  els.clearZoneImageButton?.addEventListener("click", () => clearImageField("zone"));
  els.deleteItemButton.addEventListener("click", deleteCurrentItem);
  els.saveSettingsButton.addEventListener("click", saveSettings);
  els.exportButton.addEventListener("click", exportData);
  els.importInput.addEventListener("change", importData);
  els.clearButton.addEventListener("click", clearData);
  els.syncButton.addEventListener("click", syncNow);
  els.editFromDetailButton.addEventListener("click", () => {
    if (state.selectedItemId) openItemModal(state.selectedItemId);
  });
  els.openContainerButton.addEventListener("click", () => {
    const item = getItemById(state.selectedItemId);
    if (item) openContainerForLocation(item.location);
  });
  els.containerAddItemButton.addEventListener("click", () => {
    if (state.selectedLocation) openItemModal(null, state.selectedLocation);
  });
  els.zoneDetailAddLocationButton.addEventListener("click", () => {
    if (state.selectedZone) openLocationModal("", state.selectedZone);
  });
  els.searchInput.addEventListener("search", render);
}

function handleMenuToggle(event) {
  const menu = event.target;
  if (!menu.matches?.(".location-menu, .zone-menu") || !menu.open) return;
  closeOpenMenus(menu);
}

function handleDocumentClick(event) {
  if (event.target.closest?.(".location-menu, .zone-menu")) return;
  closeOpenMenus();
}

function closeOpenMenus(except = null) {
  document.querySelectorAll(".location-menu[open], .zone-menu[open]").forEach((menu) => {
    if (menu !== except) menu.removeAttribute("open");
  });
}

function createInitialData() {
  const locations = [...DEFAULT_LOCATIONS, "床头柜-抽屉"];
  return {
    householdName: "我们的小家",
    memberName: "",
    locations,
    zones: [...DEFAULT_ZONES],
    locationMeta: createDefaultLocationMeta(locations),
    zoneMeta: createDefaultZoneMeta(DEFAULT_ZONES),
    containers: DEFAULT_CONTAINERS,
    items: [],
    deletedItems: {},
    deletedLocations: {},
    deletedZones: {},
    updatedAt: new Date().toISOString()
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();
    const parsed = JSON.parse(raw);
    const loaded = {
      ...createInitialData(),
      ...parsed,
      locations: Array.isArray(parsed.locations) ? parsed.locations : createInitialData().locations,
      zones: Array.isArray(parsed.zones) ? parsed.zones : createInitialData().zones,
      locationMeta: parsed.locationMeta && typeof parsed.locationMeta === "object" ? parsed.locationMeta : {},
      zoneMeta: parsed.zoneMeta && typeof parsed.zoneMeta === "object" ? parsed.zoneMeta : {},
      containers: Array.isArray(parsed.containers) ? upgradeContainers(parsed.containers) : DEFAULT_CONTAINERS,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      deletedItems: parsed.deletedItems && typeof parsed.deletedItems === "object" ? parsed.deletedItems : {},
      deletedLocations: parsed.deletedLocations && typeof parsed.deletedLocations === "object" ? parsed.deletedLocations : {},
      deletedZones: parsed.deletedZones && typeof parsed.deletedZones === "object" ? parsed.deletedZones : {}
    };
    loaded.locations = [...new Set([...createInitialData().locations, ...loaded.locations, ...loaded.containers.flatMap((container) => container.locations || [])])];
    return normalizeInventoryData(loaded);
  } catch {
    return createInitialData();
  }
}

function normalizeInventoryData(data) {
  const normalized = { ...createInitialData(), ...data };
  const locations = Array.isArray(normalized.locations) ? normalized.locations : [];
  normalized.deletedLocations = normalized.deletedLocations && typeof normalized.deletedLocations === "object"
    ? normalized.deletedLocations
    : {};
  normalized.deletedZones = normalized.deletedZones && typeof normalized.deletedZones === "object"
    ? normalized.deletedZones
    : {};
  const itemLocations = Array.isArray(normalized.items)
    ? normalized.items.map((item) => item.location).filter(Boolean)
    : [];
  normalized.locations = [...new Set([...locations, ...itemLocations])]
    .filter(Boolean)
    .filter((location) => shouldKeepLocation(location, normalized));
  normalized.locationMeta = normalizeLocationMeta(normalized.locations, normalized.locationMeta, normalized.zones || DEFAULT_ZONES);
  normalized.zones = normalizeZones(normalized);
  normalized.zoneMeta = normalizeZoneMeta(normalized.zones, normalized.zoneMeta);
  return normalized;
}

function shouldKeepLocation(location, data) {
  const deletedAt = data.deletedLocations?.[location];
  if (!deletedAt) return true;
  const deletedTime = new Date(deletedAt || 0).getTime();
  const metaTime = new Date(data.locationMeta?.[location]?.updatedAt || 0).getTime();
  const itemIsNewer = (data.items || []).some((item) => {
    if (item.location !== location) return false;
    return new Date(item.updatedAt || 0).getTime() > deletedTime;
  });
  return itemIsNewer || metaTime > deletedTime;
}

function createDefaultLocationMeta(locations) {
  return normalizeLocationMeta(locations, {});
}

function createDefaultZoneMeta(zones) {
  return normalizeZoneMeta(zones, {});
}

function normalizeLocationMeta(locations, meta = {}, zones = DEFAULT_ZONES) {
  const now = new Date().toISOString();
  return Object.fromEntries(
    locations.map((location) => {
      const existing = meta?.[location] || {};
      return [
        location,
        {
          zone: existing.zone || inferLocationZone(location, zones),
          note: existing.note || "",
          image: existing.image || "",
          updatedAt: existing.updatedAt || now
        }
      ];
    })
  );
}

function normalizeZoneMeta(zones, meta = {}) {
  const now = new Date().toISOString();
  return Object.fromEntries(
    zones.map((zone) => {
      const existing = meta?.[zone] || {};
      return [
        zone,
        {
          image: existing.image || "",
          updatedAt: existing.updatedAt || now
        }
      ];
    })
  );
}

function normalizeZones(data) {
  const zones = Array.isArray(data.zones) ? data.zones : DEFAULT_ZONES;
  const usedZones = Object.values(data.locationMeta || {})
    .map((meta) => meta?.zone)
    .filter(Boolean);
  return [...new Set([...zones, ...usedZones])]
    .filter(Boolean)
    .filter((zone) => !data.deletedZones?.[zone]);
}

function upgradeContainers(containers) {
  const byId = new Map(DEFAULT_CONTAINERS.map((container) => [container.id, container]));
  const defaultIds = new Set(DEFAULT_CONTAINERS.map((container) => container.id));
  const upgraded = DEFAULT_CONTAINERS.map((fallback) => {
    const existing = containers.find((container) => container.id === fallback.id);
    if (!existing) return fallback;
    return {
      ...fallback,
      ...existing,
      position: fallback.position,
      size: fallback.size,
      locations: Array.isArray(existing.locations) && existing.locations.length ? existing.locations : fallback.locations
    };
  });

  containers.forEach((container) => {
    if (!container?.id || defaultIds.has(container.id)) return;
    upgraded.push(normalizeCustomContainer(container, upgraded.length));
    byId.set(container.id, container);
  });

  return upgraded;
}

function normalizeCustomContainer(container, index) {
  const fallback = getContainerPreset(container.type || "box");
  return {
    ...fallback,
    ...container,
    id: container.id || crypto.randomUUID(),
    name: container.name || "新容器",
    type: container.type || "box",
    locations: Array.isArray(container.locations) && container.locations.length ? container.locations : [container.name || "新容器"],
    position: container.position && Number.isFinite(Number(container.position.x))
      ? container.position
      : getZonePosition("center", index),
    size: container.size || fallback.size,
    color: container.color || fallback.color,
    accent: container.accent || fallback.accent,
    description: container.description || fallback.description
  };
}

async function persistData({ silent = false } = {}) {
  state.data = normalizeInventoryData(state.data);
  state.data.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  render();

  if (state.syncClient && !state.saving) {
    state.saving = true;
    try {
      const remote = await state.syncClient.load();
      state.data = mergeInventoryData(state.data, remote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      render();
      await state.syncClient.save(state.data);
      setSyncStatus("online", "已同步", "云端和本机数据已更新。");
    } catch (error) {
      setSyncStatus("offline", "同步失败", error.message || "稍后再试。");
    } finally {
      state.saving = false;
    }
  }

  if (!silent) showToast("已保存");
}

function render() {
  renderStats();
  renderCategoryFilters();
  renderItems();
  renderLocationFilters();
  renderLocations();
  renderZones();
  renderReplenish();
  renderSearchResults();
  updateActiveTabs();
}

function renderStats() {
  els.itemCount.textContent = state.data.items.length;
  els.locationCount.textContent = state.data.locations.length;
  els.lowCount.textContent = getLowStockItems().length;
  if (els.containerCount) els.containerCount.textContent = getContainers().length;
}

function renderCategoryFilters() {
  const categories = ["全部", ...new Set(state.data.items.map((item) => item.category).filter(Boolean))];
  const allCategories = categories.length > 1 ? categories : DEFAULT_CATEGORIES.map((cat) => cat.name);
  els.categoryFilters.innerHTML = "";

  allCategories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip${state.category === category ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => {
      state.category = category;
      render();
    });
    els.categoryFilters.appendChild(button);
  });
}

function renderItems() {
  els.listMode.classList.remove("hidden");
  const items = getFilteredItems();
  els.itemList.innerHTML = "";
  els.emptyItems.classList.toggle("visible", items.length === 0);

  items.forEach((item) => {
    els.itemList.appendChild(createItemCard(item));
  });
}

function renderSpaceState() {
  document.querySelectorAll("[data-space-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.spaceMode === state.spaceMode);
  });
  els.sceneTip?.classList.toggle("hidden", state.spaceMode !== "scene");
  els.spaceStage?.classList.toggle("hidden", state.spaceMode !== "scene");
  els.listMode.classList.toggle("hidden", false);
}

function renderSearchResults() {
  const query = state.search.trim();
  if (!els.searchResults) return;
  els.searchResults.innerHTML = "";
  if (!query) {
    els.searchResults.classList.remove("visible");
    return;
  }

  const results = getSearchMatches().slice(0, 6);
  els.searchResults.classList.add("visible");
  if (!results.length) {
    els.searchResults.innerHTML = '<div class="search-empty">没有找到匹配的物品</div>';
    return;
  }
  results.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    button.innerHTML = `
      ${createThumbnailMarkup(item, "sm")}
      <div class="search-result-copy">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.location || "未设置位置")}</span>
      </div>
    `;
    button.addEventListener("click", () => openItemDetail(item.id));
    els.searchResults.appendChild(button);
  });
}

function getSearchMatches() {
  const query = state.search.trim().toLowerCase();
  if (!query) return [];
  return state.data.items
    .filter((item) =>
      [item.name, item.category, item.location, item.note, item.brand, item.spec, item.purchaseDate, item.expiryDate]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function createItemCard(item) {
  const card = document.createElement("article");
  card.className = "item-card";
  card.addEventListener("click", () => openItemDetail(item.id));

  const color = getCategoryColor(item.category);
  const isLow = isLowStock(item);
  const qty = formatQuantity(item);

  card.innerHTML = `
    <div class="item-main">
      ${createThumbnailMarkup(item)}
      <div class="item-copy">
        <div class="item-title">
          <span class="category-dot" style="background:${color}"></span>
          <strong>${escapeHtml(item.name)}</strong>
        </div>
        <div class="meta-line">
          <span>${escapeHtml(item.category || "未分类")}</span>
          <span>·</span>
          <span>${escapeHtml(item.location || "未设置位置")}</span>
        </div>
        ${item.note ? `<div class="meta-line">${escapeHtml(item.note)}</div>` : ""}
      </div>
    </div>
    <div class="qty-box">
      <strong>${escapeHtml(qty)}</strong>
      ${isLow ? `<span class="low-badge">需补货</span>` : ""}
      <div class="stepper" aria-label="调整数量">
        <button type="button" data-delta="-1" aria-label="减少数量">-</button>
        <button type="button" data-delta="1" aria-label="增加数量">+</button>
      </div>
      <button type="button" class="mini-link" data-edit="1">编辑</button>
    </div>
  `;

  card.querySelectorAll("[data-delta]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      adjustQuantity(item.id, Number(button.dataset.delta));
    });
  });

  card.querySelector("[data-edit]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    openItemModal(item.id);
  });

  return card;
}

function renderLocations() {
  els.locationGrid.innerHTML = "";
  const locations = getFilteredLocations();
  els.emptyLocations?.classList.toggle("visible", locations.length === 0);

  locations.forEach((location) => {
    const items = getItemsForLocation(location);
    const lowCount = items.filter(isLowStock).length;
    const meta = getLocationMeta(location);
    const updatedAt = getLocationUpdatedAt(location);
    const card = document.createElement("article");
    card.className = `location-card${items.length === 0 ? " is-empty" : ""}`;
    card.innerHTML = `
      <div class="location-card-head">
        <div class="location-card-title">
          ${createEntityThumbnailMarkup(meta.image, location, "md")}
          <div>
            <strong>${escapeHtml(location)}</strong>
            <span>${escapeHtml(meta.zone || "其他")}</span>
          </div>
        </div>
        <details class="location-menu">
          <summary aria-label="位置设置" title="位置设置">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.7V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1h.1a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.7 1Z"/></svg>
          </summary>
          <div class="location-menu-panel">
            <button type="button" data-action="edit">编辑</button>
            <button type="button" class="danger" data-action="delete">删除</button>
          </div>
        </details>
      </div>
      <div class="location-card-stats">
        <span><b>${items.length}</b> 件物品</span>
        <span>${lowCount ? `${lowCount} 待补` : escapeHtml(formatDateShort(updatedAt))}</span>
      </div>
      ${meta.note ? `<p>${escapeHtml(meta.note)}</p>` : `<p class="muted">没有说明</p>`}
    `;
    const menu = card.querySelector(".location-menu");
    menu?.addEventListener("click", (event) => event.stopPropagation());
    menu?.addEventListener("pointerdown", (event) => event.stopPropagation());
    menu?.querySelector("summary")?.addEventListener("click", (event) => event.stopPropagation());
    card.addEventListener("click", (event) => {
      if (event.target.closest(".location-menu")) return;
      closeOpenMenus();
      openContainerForLocation(location);
    });
    card.querySelector('[data-action="edit"]').addEventListener("click", (event) => {
      event.stopPropagation();
      closeOpenMenus();
      openLocationModal(location);
    });
    card.querySelector('[data-action="delete"]').addEventListener("click", (event) => {
      event.stopPropagation();
      closeOpenMenus();
      confirmDeleteLocation(location);
    });
    els.locationGrid.appendChild(card);
  });
}

function renderLocationFilters() {
  if (!els.locationFilters) return;
  const locations = state.data.locations || [];
  const filters = [
    { id: "all", label: `全部 ${locations.length}` },
    { id: "active", label: `有物品 ${locations.filter((location) => getItemsForLocation(location).length > 0).length}` },
    { id: "empty", label: `空位置 ${locations.filter((location) => getItemsForLocation(location).length === 0).length}` },
    { id: "low", label: `有待补 ${locations.filter((location) => getItemsForLocation(location).some(isLowStock)).length}` },
    { id: "temporary", label: "待整理" }
  ];
  els.locationFilters.innerHTML = "";
  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `chip${state.locationFilter === filter.id ? " active" : ""}`;
    button.type = "button";
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.locationFilter = filter.id;
      renderLocations();
      renderLocationFilters();
    });
    els.locationFilters.appendChild(button);
  });
}

function renderZones() {
  if (!els.zoneGrid) return;
  const zones = [...state.data.zones].sort((a, b) => a.localeCompare(b, "zh-CN"));
  els.zoneGrid.innerHTML = "";
  els.emptyZones?.classList.toggle("visible", zones.length === 0);

  zones.forEach((zone) => {
    const meta = getZoneMeta(zone);
    const locations = getLocationsForZone(zone);
    const itemCount = locations.reduce((sum, location) => sum + getItemsForLocation(location).length, 0);
    const lowCount = locations.reduce((sum, location) => sum + getItemsForLocation(location).filter(isLowStock).length, 0);
    const card = document.createElement("article");
    card.className = `zone-card${locations.length === 0 ? " is-empty" : ""}`;
    card.innerHTML = `
      <div class="zone-card-head">
        <div class="zone-card-title">
          ${createEntityThumbnailMarkup(meta.image, zone, "md")}
          <div>
            <strong>${escapeHtml(zone)}</strong>
            <span>${locations.length} 个位置</span>
          </div>
        </div>
        <details class="zone-menu">
          <summary aria-label="区域设置" title="区域设置">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.7V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1h.1a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.7 1Z"/></svg>
          </summary>
          <div class="zone-menu-panel">
            <button type="button" data-action="edit">编辑</button>
            <button type="button" class="danger" data-action="delete">删除</button>
          </div>
        </details>
      </div>
      <div class="zone-card-stats">
        <span><b>${itemCount}</b> 件物品</span>
        <span>${lowCount ? `${lowCount} 待补` : "点击查看"}</span>
      </div>
    `;
    const menu = card.querySelector(".zone-menu");
    menu?.addEventListener("click", (event) => event.stopPropagation());
    menu?.addEventListener("pointerdown", (event) => event.stopPropagation());
    menu?.querySelector("summary")?.addEventListener("click", (event) => event.stopPropagation());
    card.addEventListener("click", (event) => {
      if (event.target.closest(".zone-menu")) return;
      closeOpenMenus();
      openZoneDetail(zone);
    });
    card.querySelector('[data-action="edit"]').addEventListener("click", (event) => {
      event.stopPropagation();
      closeOpenMenus();
      openZoneModal(zone);
    });
    card.querySelector('[data-action="delete"]').addEventListener("click", (event) => {
      event.stopPropagation();
      closeOpenMenus();
      deleteZone(zone);
    });
    els.zoneGrid.appendChild(card);
  });
}

function getLocationsForZone(zone) {
  return state.data.locations.filter((location) => getLocationMeta(location).zone === zone);
}

function getFilteredLocations() {
  return [...state.data.locations]
    .filter((location) => {
      const meta = getLocationMeta(location);
      const items = getItemsForLocation(location);
      if (state.locationFilter === "active") return items.length > 0;
      if (state.locationFilter === "empty") return items.length === 0;
      if (state.locationFilter === "low") return items.some(isLowStock);
      if (state.locationFilter === "temporary") return /临时|待整理|待归位|暂存/.test(location) || meta.zone === "临时";
      return true;
    })
    .sort((a, b) => {
      const countDiff = getItemsForLocation(b).length - getItemsForLocation(a).length;
      if (countDiff) return countDiff;
      return a.localeCompare(b, "zh-CN");
    });
}

function renderReplenish() {
  const lowItems = getLowStockItems();
  els.replenishList.innerHTML = "";
  els.replenishHint.textContent = lowItems.length ? `${lowItems.length} 件` : "";
  els.emptyReplenish.classList.toggle("visible", lowItems.length === 0);

  lowItems.forEach((item) => {
    els.replenishList.appendChild(createItemCard(item));
  });
}

function createThumbnailMarkup(item, size = "md") {
  const thumb = item.thumbnail || "";
  const label = getItemAbbreviation(item.name);
  const color = getCategoryColor(item.category);
  const classes = `thumb thumb-${size}`;
  if (thumb) {
    return `<div class="${classes}"><img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.name)}"></div>`;
  }
  return `<div class="${classes}" style="--thumb-color:${color}">${escapeHtml(label)}</div>`;
}

function createEntityThumbnailMarkup(image, label, size = "md") {
  const classes = `thumb thumb-${size} entity-thumb`;
  if (image) {
    return `<div class="${classes}"><img src="${escapeHtml(image)}" alt="${escapeHtml(label)}"></div>`;
  }
  return `<div class="${classes}" style="--thumb-color:#7b8fa1">${escapeHtml(getItemAbbreviation(label))}</div>`;
}

function getItemAbbreviation(name) {
  const clean = String(name || "").trim();
  if (!clean) return "物";
  const chars = clean.replace(/\s+/g, "").slice(0, 2);
  return chars;
}

function getItemById(id) {
  return state.data.items.find((item) => item.id === id) || null;
}

function getContainerById(id) {
  return getContainers().find((container) => container.id === id) || null;
}

function getContainers() {
  const containers = Array.isArray(state.data.containers) && state.data.containers.length
    ? state.data.containers
    : DEFAULT_CONTAINERS;
  return upgradeContainers(containers);
}

function getContainerPreset(type) {
  const presets = {
    wardrobe: {
      type: "wardrobe",
      size: { w: 2.1, h: 3.2, d: 1.3 },
      color: "#b9885a",
      accent: "#8e6337",
      description: "衣物和大件收纳"
    },
    box: {
      type: "box",
      size: { w: 1.8, h: 1.05, d: 1.25 },
      color: "#7b8fa1",
      accent: "#4f6578",
      description: "收纳盒"
    },
    drawer: {
      type: "drawer",
      size: { w: 1.45, h: 1.35, d: 1.25 },
      color: "#9f7b59",
      accent: "#6a4a31",
      description: "抽屉和床头柜"
    },
    shelf: {
      type: "shelf",
      size: { w: 2.0, h: 2.5, d: 0.9 },
      color: "#8a9b69",
      accent: "#607043",
      description: "书架或置物架"
    },
    cabinet: {
      type: "cabinet",
      size: { w: 1.55, h: 1.9, d: 0.9 },
      color: "#8ca1b5",
      accent: "#5f7487",
      description: "柜子"
    },
    crate: {
      type: "crate",
      size: { w: 1.6, h: 1.05, d: 1.1 },
      color: "#bc906c",
      accent: "#8d6341",
      description: "临时收纳"
    }
  };
  return presets[type] || presets.box;
}

function getZonePosition(zone, index = getContainers().length) {
  const jitter = (index % 4) * 4;
  const positions = {
    left: { x: 24 + jitter, y: 48 + (index % 2) * 16, z: 20 + index },
    center: { x: 48 + jitter, y: 50 + (index % 2) * 14, z: 20 + index },
    right: { x: 72 - jitter, y: 48 + (index % 2) * 16, z: 20 + index },
    front: { x: 50 + jitter, y: 74, z: 20 + index },
    back: { x: 50 + jitter, y: 27, z: 20 + index }
  };
  return positions[zone] || positions.center;
}

function getContainerForLocation(location) {
  const exact = getContainers().find((container) => container.locations.includes(location));
  if (exact) return exact;
  return getContainers().find((container) => location?.includes(container.name)) || getContainers()[getContainers().length - 1];
}

function getItemsForLocation(location) {
  return state.data.items.filter((item) => item.location === location);
}

function getItemsForContainer(container) {
  if (!container) return [];
  return state.data.items.filter((item) => container.locations.includes(item.location));
}

function openContainerForLocation(location) {
  if (!location) return;
  state.selectedLocation = location;
  els.containerTitle.textContent = location;
  if (els.containerAddItemButton) {
    els.containerAddItemButton.disabled = false;
  }
  renderContainerModal();
  switchContainerMode(state.containerMode);
  els.containerModal.showModal();
}

function openContainer(containerId) {
  const container = getContainerById(containerId);
  if (!container) return;
  openContainerForLocation(container.locations[0]);
}

function renderContainerModal() {
  const location = state.selectedLocation || state.data.locations[0] || "";
  if (!location) return;
  const items = getItemsForLocation(location);
  const meta = getLocationMeta(location);
  const lowCount = items.filter(isLowStock).length;
  els.containerTitle.textContent = location;
  els.containerMeta.textContent = `${meta.zone || "其他"} · ${items.length} 件物品${lowCount ? ` · ${lowCount} 件待补` : ""}${meta.note ? ` · ${meta.note}` : ""}`;
  els.containerItemsGrid.innerHTML = "";
  els.containerItemsTableBody.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "container-item-card";
    card.innerHTML = `
      ${createThumbnailMarkup(item, "sm")}
      <div class="container-item-copy">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(formatQuantity(item))}</span>
      </div>
    `;
    card.addEventListener("click", () => openItemDetail(item.id));
    els.containerItemsGrid.appendChild(card);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="table-item">
          ${createThumbnailMarkup(item, "xs")}
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td>${escapeHtml(formatQuantity(item))}</td>
      <td>${escapeHtml(item.category || "未分类")}</td>
      <td>${escapeHtml(item.location || "未设置位置")}</td>
    `;
    row.addEventListener("click", () => openItemDetail(item.id));
    els.containerItemsTableBody.appendChild(row);
  });

  if (!items.length) {
    els.containerItemsGrid.innerHTML = '<div class="empty-state visible"><h3>这个位置还没有物品</h3></div>';
    els.containerItemsTableBody.innerHTML = '<tr><td colspan="4" class="empty-table">这个位置还没有物品</td></tr>';
  }
}

function switchSpaceMode(mode) {
  state.spaceMode = mode;
  render();
}

function switchContainerMode(mode) {
  state.containerMode = mode;
  document.querySelectorAll("[data-container-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.containerMode === mode);
  });
  els.containerItemsGrid.classList.toggle("hidden", mode !== "grid");
  els.containerItemsTableWrap.classList.toggle("hidden", mode !== "table");
}

function openContainerForm() {
  els.newContainerName.value = "";
  els.newContainerType.value = "box";
  els.newContainerLocation.value = "";
  els.newContainerDescription.value = "";
  els.newContainerZone.value = "center";
  els.containerFormModal.showModal();
  setTimeout(() => els.newContainerName.focus(), 80);
}

async function saveContainerFromForm(event) {
  event.preventDefault();
  const name = els.newContainerName.value.trim();
  const type = els.newContainerType.value;
  const location = els.newContainerLocation.value.trim();
  const description = els.newContainerDescription.value.trim();
  const zone = els.newContainerZone.value;
  if (!name || !location) return;

  const preset = getContainerPreset(type);
  const container = {
    id: `container-${crypto.randomUUID()}`,
    name,
    type,
    locations: [location],
    position: getZonePosition(zone),
    size: preset.size,
    color: preset.color,
    accent: preset.accent,
    description: description || preset.description,
    updatedAt: new Date().toISOString()
  };

  state.data.containers.push(container);
  if (!state.data.locations.includes(location)) {
    state.data.locations.push(location);
  }
  state.selectedContainerId = container.id;
  closeDialogs();
  buildSpaceScene();
  focusContainerInSpace(container.id);
  await persistData();
}

function openItemDetail(itemId) {
  const item = getItemById(itemId);
  if (!item) return;
  state.selectedItemId = itemId;
  const locationMeta = getLocationMeta(item.location);
  els.detailTitle.textContent = item.name;
  els.detailThumb.innerHTML = createThumbnailMarkup(item, "lg");
  els.detailCategory.textContent = item.category || "未分类";
  els.detailQuantity.textContent = formatQuantity(item);
  els.detailLocation.textContent = item.location ? `${item.location} · ${locationMeta.zone || "其他"}` : "未设置位置";
  els.detailNote.textContent = item.note || "没有备注";
  els.openContainerButton.textContent = item.location ? "看这个位置" : "未设置位置";
  els.openContainerButton.disabled = !item.location;
  const details = [
    ["品牌", item.brand || "未填"],
    ["规格", item.spec || "未填"],
    ["购买日期", item.purchaseDate || "未填"],
    ["到期日期", item.expiryDate || "未填"],
    ["余量提醒", item.trackStock ? `低于 ${item.minQuantity ?? 0}` : "未开启"],
    ["更新时间", item.updatedAt ? new Date(item.updatedAt).toLocaleString("zh-CN") : "未填"]
  ];
  els.detailGrid.innerHTML = details
    .map(([label, value]) => `<div class="detail-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");
  els.detailModal.showModal();
}

function closeDialogs() {
  [els.itemModal, els.locationModal, els.zoneModal, els.zoneDetailModal, els.detailModal, els.containerModal, els.containerFormModal].forEach((dialog) => {
    if (dialog?.open) dialog.close();
  });
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll(".view").forEach((viewEl) => {
    viewEl.classList.toggle("active", viewEl.id === `${view}View`);
  });
  updateActiveTabs();
}

function updateActiveTabs() {
  document.querySelectorAll(".tab, .stat-pill").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
}

function updateSpaceSelection() {
  const container = getContainerById(state.selectedContainerId) || getContainers()[0];
  if (!container) return;
  const items = getItemsForContainer(container);
  els.selectedContainerName.textContent = container.name;
  els.selectedContainerMeta.textContent = `${container.description} · ${items.length} 件`;
}

function focusContainerInSpace(containerId) {
  if (!state.space) return;
  const container = getContainerById(containerId);
  if (!container) return;
  state.selectedContainerId = containerId;
  state.space.targetYaw = clamp((50 - Number(container.position.x || 50)) * 0.8, -28, 28);
  state.space.targetPitch = 62;
  updateSpaceSelection();
  updateSpaceScene();
}

function updateSpaceScene() {
  if (!state.space) return;
  getContainers().forEach((container) => {
    const itemCount = getItemsForContainer(container).length;
    const node = state.space.nodes.get(container.id);
    if (node) {
      node.classList.toggle("selected", container.id === state.selectedContainerId);
      const label = node.querySelector(".container-label");
      if (label) {
        label.querySelector("strong").textContent = container.name;
        label.querySelector("em").textContent = `${itemCount} 件`;
      }
    }
  });
}

function initSpaceExperience() {
  if (!els.spaceCanvas) return;

  els.spaceCanvas.innerHTML = `
    <div class="space-scene">
      <div class="space-world" id="spaceWorld">
        <div class="space-ambience"></div>
        <div class="space-floor"></div>
        <div class="space-wall back"></div>
        <div class="space-wall left"></div>
        <div class="space-wall right"></div>
        <div class="space-containers" id="spaceContainers"></div>
      </div>
    </div>
  `;

  const world = document.getElementById("spaceWorld");
  const containersLayer = document.getElementById("spaceContainers");
  const scene = {
    world,
    containersLayer,
    nodes: new Map(),
    yaw: -22,
    pitch: 62,
    targetYaw: -22,
    targetPitch: 62,
    dragging: false,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0
  };

  state.space = scene;
  buildSpaceScene();

  const stage = els.spaceStage;
  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".container-3d")) return;
    scene.dragging = true;
    scene.startX = event.clientX;
    scene.startY = event.clientY;
    scene.startYaw = scene.targetYaw;
    scene.startPitch = scene.targetPitch;
  });

  stage.addEventListener("pointermove", (event) => {
    if (!scene.dragging) return;
    const dx = event.clientX - scene.startX;
    const dy = event.clientY - scene.startY;
    scene.targetYaw = clamp(scene.startYaw + dx * 0.14, -55, 35);
    scene.targetPitch = clamp(scene.startPitch - dy * 0.06, 50, 72);
  });

  const endDrag = () => {
    scene.dragging = false;
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  const tick = () => {
    if (!state.space) return;
    scene.yaw += (scene.targetYaw - scene.yaw) * 0.1;
    scene.pitch += (scene.targetPitch - scene.pitch) * 0.1;
    scene.world.style.setProperty("--yaw", `${scene.yaw}deg`);
    scene.world.style.setProperty("--pitch", `${scene.pitch}deg`);
    requestAnimationFrame(tick);
  };

  updateSpaceSelection();
  updateSpaceScene();
  tick();
}

function buildSpaceScene() {
  if (!state.space) return;
  const { containersLayer, nodes } = state.space;
  containersLayer.innerHTML = "";
  nodes.clear();

  getContainers().forEach((container) => {
    const node = document.createElement("button");
    const width = Math.max(92, container.size.w * 52);
    const height = Math.max(88, container.size.h * 52);
    const depth = Math.max(18, container.size.d * 26);
    node.type = "button";
    node.className = `container-3d type-${container.type}`;
    node.dataset.containerId = container.id;
    node.style.zIndex = String(10 + Number(container.position.z || 1));
    node.style.setProperty("--x", `${clamp(Number(container.position.x) || 50, 8, 92)}%`);
    node.style.setProperty("--y", `${clamp(Number(container.position.y) || 54, 18, 86)}%`);
    node.style.setProperty("--depth-order", String(Number(container.position.z) || 1));
    node.style.setProperty("--w", `${width}px`);
    node.style.setProperty("--h", `${height}px`);
    node.style.setProperty("--d", `${depth}px`);
    node.style.setProperty("--base", container.color);
    node.style.setProperty("--accent", container.accent);
    node.innerHTML = `
      <span class="container-shadow"></span>
      <span class="container-top"></span>
      <span class="container-body"></span>
      <span class="container-edge"></span>
      <span class="container-detail one"></span>
      <span class="container-detail two"></span>
      <span class="container-label">
        <strong>${escapeHtml(container.name)}</strong>
        <em>0 件</em>
      </span>
    `;
    node.addEventListener("click", () => openContainer(container.id));
    containersLayer.appendChild(node);
    nodes.set(container.id, node);
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildContainerGroup(THREE, container) {
  const group = new THREE.Group();
  group.position.set(container.position.x, 0, container.position.z);
  group.userData.containerId = container.id;

  let bodyMaterial;
  let labelOffset = 1.4;
  const baseColor = new THREE.Color(container.color);
  const accentColor = new THREE.Color(container.accent);

  if (container.type === "wardrobe") {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(container.size.w, container.size.h, container.size.d),
      bodyMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.9, metalness: 0.02, emissive: 0x000000 })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = container.size.h / 2;
    group.add(body);
    group.add(makeHandle(THREE, 0.52, 1.6, 0.76, accentColor));
    group.add(makeHandle(THREE, -0.52, 1.6, 0.76, accentColor));
    group.add(makeTop(THREE, container.size, accentColor));
    labelOffset = container.size.h + 0.35;
  } else if (container.type === "shelf") {
    bodyMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.92, emissive: 0x000000 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(container.size.w, container.size.h, container.size.d), bodyMaterial);
    frame.castShadow = true;
    frame.receiveShadow = true;
    frame.position.y = container.size.h / 2;
    group.add(frame);
    group.add(makeShelfBoards(THREE, container, accentColor));
    labelOffset = container.size.h + 0.35;
  } else if (container.type === "drawer") {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(container.size.w, container.size.h, container.size.d),
      bodyMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.88, emissive: 0x000000 })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = container.size.h / 2;
    group.add(body);
    group.add(makeDrawerLines(THREE, container.size, accentColor));
    labelOffset = container.size.h + 0.35;
  } else {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(container.size.w, container.size.h, container.size.d),
      bodyMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.9, emissive: 0x000000 })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = container.size.h / 2;
    group.add(body);
    group.add(makeTop(THREE, container.size, accentColor));
    labelOffset = container.size.h + 0.35;
  }

  const label = makeLabelSprite(THREE, container.name, "0 件", container.color, container.accent);
  label.position.set(0, labelOffset, 0);
  group.add(label);

  group.traverse((object) => {
    object.userData.containerId = container.id;
  });
  group.userData.bodyMaterial = bodyMaterial;
  group.userData.label = label;
  group.userData.container = container;
  return group;
}

function makeLabelSprite(THREE, title, subtitle, color, accent) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(ctx, 18, 24, 476, 140, 28, true, false);
  ctx.fillStyle = accent;
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(title, 42, 82);
  ctx.fillStyle = color;
  ctx.font = "28px sans-serif";
  ctx.fillText(subtitle, 42, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(2.9, 1.1, 1);
  sprite.userData.canvas = canvas;
  sprite.userData.texture = texture;
  return sprite;
}

function updateLabelSprite(sprite, text, color, accent, selected) {
  const canvas = sprite.userData.canvas;
  const texture = sprite.userData.texture;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selected ? "rgba(215, 240, 232, 0.98)" : "rgba(255,255,255,0.92)";
  roundRect(ctx, 18, 24, 476, 140, 28, true, false);
  const [title, subtitle] = text.split("\n");
  ctx.fillStyle = accent;
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(title || "", 42, 82);
  ctx.fillStyle = color;
  ctx.font = "28px sans-serif";
  ctx.fillText(subtitle || "", 42, 128);
  texture.needsUpdate = true;
}

function makeTop(THREE, size, accentColor) {
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(size.w + 0.05, 0.12, size.d + 0.05),
    new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.8 })
  );
  top.position.y = size.h + 0.06;
  top.castShadow = true;
  return top;
}

function makeHandle(THREE, x, y, z, color) {
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  );
  handle.rotation.z = Math.PI / 2;
  handle.position.set(x, y, z);
  return handle;
}

function makeShelfBoards(THREE, container, accentColor) {
  const group = new THREE.Group();
  [0.6, 1.35, 2.05].forEach((y) => {
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(container.size.w + 0.02, 0.08, container.size.d + 0.02),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.9 })
    );
    board.position.set(0, y, 0);
    group.add(board);
  });
  const divider = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, container.size.h, container.size.d),
    new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.95 })
  );
  divider.position.set(0, container.size.h / 2, 0);
  group.add(divider);
  return group;
}

function makeDrawerLines(THREE, size, accentColor) {
  const group = new THREE.Group();
  for (let i = 0; i < 2; i += 1) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(size.w - 0.18, 0.06, 0.04),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.9 })
    );
    line.position.set(0, 0.45 + i * 0.42, size.d / 2 + 0.02);
    group.add(line);
  }
  return group;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function hideSpaceScene() {
  els.spaceStage.classList.add("hidden");
}

function getFilteredItems() {
  return state.data.items
    .filter((item) => {
      if (!state.search) return true;
      return [item.name, item.category, item.location, item.note, item.brand, item.spec, item.purchaseDate, item.expiryDate]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(state.search));
    })
    .filter((item) => state.search || state.category === "全部" || item.category === state.category)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function getLowStockItems() {
  return state.data.items.filter(isLowStock);
}

function isLowStock(item) {
  return Boolean(item.trackStock) && Number(item.quantity || 0) <= Number(item.minQuantity || 0);
}

function openItemModal(id = null, presetLocation = "") {
  populateFormOptions();
  const item = id ? state.data.items.find((entry) => entry.id === id) : null;
  els.itemModalTitle.textContent = item ? "编辑物品" : "新增物品";
  els.deleteItemButton.classList.toggle("hidden", !item);
  els.itemId.value = item?.id || "";
  els.itemName.value = item?.name || "";
  els.itemCategory.value = item?.category || "日用";
  const location = item?.location || presetLocation || state.data.locations[0] || "";
  const locationZone = location ? getLocationMeta(location).zone : state.data.zones[0] || "其他";
  els.itemZone.value = locationZone || "其他";
  refreshItemLocationOptions(els.itemZone.value);
  els.itemLocation.value = location;
  els.itemQuantity.value = item?.quantity ?? 1;
  els.itemUnit.value = item?.unit || "";
  els.trackStock.checked = Boolean(item?.trackStock);
  els.itemMinQuantity.value = item?.minQuantity ?? 1;
  els.itemNote.value = item?.note || "";
  els.itemBrand.value = item?.brand || "";
  els.itemSpec.value = item?.spec || "";
  els.itemPurchaseDate.value = item?.purchaseDate || "";
  els.itemExpiryDate.value = item?.expiryDate || "";
  els.itemThumbnail.value = item?.thumbnail || "";
  updateMinStockVisibility();
  els.itemModal.showModal();
  setTimeout(() => els.itemName.focus(), 80);
}

function populateFormOptions() {
  const categories = DEFAULT_CATEGORIES.filter((cat) => cat.name !== "全部").map((cat) => cat.name);
  const usedCategories = state.data.items.map((item) => item.category).filter(Boolean);
  setDatalistOptions(els.itemCategoryOptions, [...new Set([...categories, ...usedCategories])]);
  setDatalistOptions(els.itemZoneOptions, getKnownZones());
  refreshItemLocationOptions(els.itemZone?.value || state.data.zones[0] || "");
  setSelectOptions(els.locationZone, getKnownZones());
}

function setSelectOptions(select, values) {
  const current = select.value;
  select.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  if (values.includes(current)) select.value = current;
}

function setDatalistOptions(list, values) {
  if (!list) return;
  list.innerHTML = "";
  [...new Set(values.filter(Boolean))].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    list.appendChild(option);
  });
}

function getKnownZones() {
  return [...new Set([
    ...(state.data.zones || []),
    ...Object.values(state.data.locationMeta || {}).map((meta) => meta?.zone).filter(Boolean)
  ])].filter(Boolean);
}

function refreshItemLocationOptions(zoneValue = els.itemZone?.value || "") {
  const zone = String(zoneValue || "").trim();
  const locations = zone
    ? state.data.locations.filter((location) => getLocationMeta(location).zone === zone)
    : [...state.data.locations];
  setDatalistOptions(els.itemLocationOptions, locations);
}

async function handleImageUpload(event, kind) {
  const file = event.target.files?.[0];
  const imageInput = kind === "location" ? els.locationImage : els.zoneImage;
  const preview = kind === "location" ? els.locationImagePreview : els.zoneImagePreview;
  if (!imageInput || !preview) return;
  if (!file) {
    renderImagePreview(preview, imageInput.value || "", kind === "location" ? els.locationName.value : els.zoneName.value);
    return;
  }
  try {
    const dataUrl = await readFileAsDataUrl(file);
    imageInput.value = dataUrl;
    renderImagePreview(preview, dataUrl, kind === "location" ? els.locationName.value : els.zoneName.value);
  } catch (error) {
    showToast(error.message || "图片上传失败");
  }
}

function clearImageField(kind) {
  const imageInput = kind === "location" ? els.locationImage : els.zoneImage;
  const fileInput = kind === "location" ? els.locationImageFile : els.zoneImageFile;
  const preview = kind === "location" ? els.locationImagePreview : els.zoneImagePreview;
  const label = kind === "location" ? els.locationName.value : els.zoneName.value;
  if (imageInput) imageInput.value = "";
  if (fileInput) fileInput.value = "";
  if (preview) renderImagePreview(preview, "", label);
}

function renderImagePreview(container, image, label) {
  if (!container) return;
  if (image) {
    container.innerHTML = `
      <div class="image-preview-frame">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(label || "图片")}">
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div class="image-preview-empty">
      <span>${escapeHtml(getItemAbbreviation(label || "图片"))}</span>
      <em>暂无图片</em>
    </div>
  `;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || "");
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
        resolve(dataUrl);
        return;
      }
      try {
        resolve(await compressImageDataUrl(dataUrl));
      } catch {
        resolve(dataUrl);
      }
    };
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function compressImageDataUrl(dataUrl, maxSize = 1200, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function saveItemFromForm(event) {
  event.preventDefault();
  const id = els.itemId.value || crypto.randomUUID();
  const now = new Date().toISOString();
  const category = els.itemCategory.value.trim();
  const zoneInput = els.itemZone.value.trim();
  const location = els.itemLocation.value.trim();
  const zone = zoneInput || (location ? getLocationMeta(location).zone : "") || inferLocationZone(location, state.data.zones) || "其他";
  if (!location) {
    showToast("请先填写位置");
    return;
  }
  const item = {
    id,
    name: els.itemName.value.trim(),
    category: category || "未分类",
    location,
    quantity: Number(els.itemQuantity.value || 0),
    unit: els.itemUnit.value.trim(),
    trackStock: els.trackStock.checked,
    minQuantity: Number(els.itemMinQuantity.value || 0),
    note: els.itemNote.value.trim(),
    brand: els.itemBrand.value.trim(),
    spec: els.itemSpec.value.trim(),
    purchaseDate: els.itemPurchaseDate.value,
    expiryDate: els.itemExpiryDate.value,
    thumbnail: els.itemThumbnail.value.trim(),
    updatedBy: state.data.memberName || "我",
    updatedAt: now
  };

  const index = state.data.items.findIndex((entry) => entry.id === id);
  if (index >= 0) state.data.items[index] = item;
  else state.data.items.unshift(item);

  if (!state.data.zones.includes(zone)) {
    state.data.zones.push(zone);
  }
  if (!state.data.locations.includes(location)) {
    state.data.locations.push(location);
  }
  state.data.locationMeta[location] = {
    ...(state.data.locationMeta[location] || {}),
    zone,
    updatedAt: now
  };
  if (state.data.deletedLocations?.[location]) delete state.data.deletedLocations[location];
  if (state.data.deletedZones?.[zone]) delete state.data.deletedZones[zone];

  closeDialogs();
  populateFormOptions();
  await persistData();
}

async function saveLocationFromForm(event) {
  event.preventDefault();
  const originalName = els.locationOriginalName.value.trim();
  const name = els.locationName.value.trim();
  const zone = els.locationZone.value || inferLocationZone(name, state.data.zones);
  const note = els.locationNote.value.trim();
  const image = els.locationImage.value.trim();
  if (!name) return;
  const duplicate = state.data.locations.includes(name) && name !== originalName;
  if (duplicate) {
    showToast("这个位置已经存在");
    return;
  }

  const now = new Date().toISOString();
  state.data.deletedLocations = state.data.deletedLocations || {};
  if (originalName && originalName !== name) {
    const index = state.data.locations.indexOf(originalName);
    if (index >= 0) state.data.locations[index] = name;
    state.data.items.forEach((item) => {
      if (item.location === originalName) {
        item.location = name;
        item.updatedAt = now;
        item.updatedBy = state.data.memberName || "我";
      }
    });
    state.data.deletedLocations[originalName] = now;
    delete state.data.deletedLocations[name];
    delete state.data.locationMeta[originalName];
  } else if (!state.data.locations.includes(name)) {
    state.data.locations.push(name);
    delete state.data.deletedLocations[name];
  }
  state.data.locationMeta[name] = {
    zone,
    note,
    image,
    updatedAt: now
  };
  els.locationName.value = "";
  els.locationOriginalName.value = "";
  closeDialogs();
  populateFormOptions();
  await persistData();
}

function openLocationModal(location = "", presetZone = "") {
  const meta = location ? getLocationMeta(location) : { zone: "其他", note: "" };
  els.locationModalTitle.textContent = location ? "编辑位置" : "新增位置";
  els.locationOriginalName.value = location || "";
  els.locationName.value = location || "";
  setSelectOptions(els.locationZone, state.data.zones);
  if (!state.data.zones.includes(meta.zone)) {
    const option = document.createElement("option");
    option.value = meta.zone || "其他";
    option.textContent = meta.zone || "其他";
    els.locationZone.appendChild(option);
  }
  const targetZone = presetZone || meta.zone || inferLocationZone(location, state.data.zones) || "其他";
  els.locationZone.value = targetZone;
  els.locationNote.value = meta.note || "";
  if (els.locationImage) els.locationImage.value = meta.image || "";
  if (els.locationImageFile) els.locationImageFile.value = "";
  renderImagePreview(els.locationImagePreview, meta.image || "", location || targetZone || "位置");
  els.deleteLocationButton.classList.toggle("hidden", !location);
  els.locationModal.showModal();
  setTimeout(() => els.locationName.focus(), 80);
}

function openZoneModal(zone = "") {
  const meta = getZoneMeta(zone);
  els.zoneOriginalName.value = zone || "";
  els.zoneName.value = zone || "";
  els.zoneModalTitle.textContent = zone ? "编辑区域" : "新增区域";
  if (els.zoneImage) els.zoneImage.value = meta.image || "";
  if (els.zoneImageFile) els.zoneImageFile.value = "";
  renderImagePreview(els.zoneImagePreview, meta.image || "", zone || "区域");
  els.zoneModal.showModal();
  setTimeout(() => els.zoneName.focus(), 80);
}

async function saveZoneFromForm(event) {
  event.preventDefault();
  const originalName = els.zoneOriginalName.value.trim();
  const name = els.zoneName.value.trim();
  const image = els.zoneImage.value.trim();
  if (!name) return;
  if (state.data.zones.includes(name) && name !== originalName) {
    showToast("这个区域已经存在");
    return;
  }

  const now = new Date().toISOString();
  state.data.deletedZones = state.data.deletedZones || {};
  if (originalName && originalName !== name) {
    const index = state.data.zones.indexOf(originalName);
    if (index >= 0) state.data.zones[index] = name;
    state.data.locations.forEach((location) => {
      const meta = state.data.locationMeta[location];
      if (meta?.zone === originalName) {
        meta.zone = name;
        meta.updatedAt = now;
      }
    });
    state.data.deletedZones[originalName] = now;
    delete state.data.deletedZones[name];
    state.data.zoneMeta = state.data.zoneMeta || {};
    delete state.data.zoneMeta[originalName];
  } else if (!state.data.zones.includes(name)) {
    state.data.zones.push(name);
    delete state.data.deletedZones[name];
  }
  state.data.zoneMeta = state.data.zoneMeta || {};
  state.data.zoneMeta[name] = {
    image,
    updatedAt: now
  };

  els.zoneOriginalName.value = "";
  els.zoneName.value = "";
  closeDialogs();
  populateFormOptions();
  await persistData();
}

async function deleteZone(zone) {
  const used = state.data.locations.filter((location) => getLocationMeta(location).zone === zone);
  if (used.length) {
    showToast("这个区域还有位置，先把位置改到别的区域");
    return;
  }
  const confirmed = confirm(`确定删除区域「${zone}」吗？`);
  if (!confirmed) return;
  state.data.deletedZones = state.data.deletedZones || {};
  state.data.deletedZones[zone] = new Date().toISOString();
  state.data.zones = state.data.zones.filter((entry) => entry !== zone);
  if (state.data.zoneMeta) delete state.data.zoneMeta[zone];
  closeDialogs();
  populateFormOptions();
  await persistData();
}

function openZoneDetail(zone) {
  state.selectedZone = zone;
  const locations = getLocationsForZone(zone);
  const itemCount = locations.reduce((sum, location) => sum + getItemsForLocation(location).length, 0);
  const lowCount = locations.reduce((sum, location) => sum + getItemsForLocation(location).filter(isLowStock).length, 0);
  els.zoneDetailTitle.textContent = zone;
  els.zoneDetailMeta.textContent = `${locations.length} 个位置 · ${itemCount} 件物品${lowCount ? ` · ${lowCount} 件待补` : ""}`;
  els.zoneDetailList.innerHTML = "";

  locations.forEach((location) => {
    const items = getItemsForLocation(location);
    const meta = getLocationMeta(location);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zone-location-card";
    button.innerHTML = `
      ${createEntityThumbnailMarkup(meta.image, location, "sm")}
      <div>
        <strong>${escapeHtml(location)}</strong>
        <span>${items.length} 件 · ${meta.note ? escapeHtml(meta.note) : "点击查看"}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      els.zoneDetailModal.close();
      openContainerForLocation(location);
    });
    els.zoneDetailList.appendChild(button);
  });

  if (!locations.length) {
    els.zoneDetailList.innerHTML = '<div class="empty-state visible"><h3>这个区域还没有位置</h3></div>';
  }
  if (els.zoneDetailAddLocationButton) {
    els.zoneDetailAddLocationButton.disabled = false;
  }
  els.zoneDetailModal.showModal();
}

async function deleteCurrentLocation() {
  const location = els.locationOriginalName.value.trim();
  if (!location) return;
  await confirmDeleteLocation(location);
}

async function confirmDeleteLocation(location) {
  const items = getItemsForLocation(location);
  if (items.length) {
    showToast("这个位置还有物品，先把物品移走再删除");
    return;
  }
  const confirmed = confirm(`确定删除「${location}」吗？`);
  if (!confirmed) return;
  state.data.deletedLocations = state.data.deletedLocations || {};
  state.data.deletedLocations[location] = new Date().toISOString();
  state.data.locations = state.data.locations.filter((entry) => entry !== location);
  delete state.data.locationMeta[location];
  closeDialogs();
  populateFormOptions();
  await persistData();
}

async function deleteCurrentItem() {
  const id = els.itemId.value;
  if (!id) return;
  const confirmed = confirm("确定删除这个物品吗？");
  if (!confirmed) return;
  state.data.deletedItems[id] = new Date().toISOString();
  state.data.items = state.data.items.filter((item) => item.id !== id);
  closeDialogs();
  await persistData();
}

async function adjustQuantity(id, delta) {
  const item = state.data.items.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(0, Number(item.quantity || 0) + delta);
  item.updatedAt = new Date().toISOString();
  item.updatedBy = state.data.memberName || "我";
  await persistData({ silent: true });
}

function updateMinStockVisibility() {
  els.minStockWrap.classList.toggle("visible", els.trackStock.checked);
}

function populateSettings() {
  els.householdName.value = state.data.householdName || "";
  els.memberName.value = state.data.memberName || "";
}

async function saveSettings() {
  state.data.householdName = els.householdName.value.trim() || "我们的小家";
  state.data.memberName = els.memberName.value.trim();
  await persistData();
}

async function importSamples() {
  const existingNames = new Set(state.data.items.map((item) => item.name));
  const additions = SAMPLE_ITEMS
    .filter((item) => !existingNames.has(item.name))
    .map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      updatedBy: state.data.memberName || "我",
      updatedAt: new Date().toISOString()
    }));

  if (!additions.length) {
    showToast("示例已经导入过了");
    return;
  }

  state.data.items.unshift(...additions);
  await persistData();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `小家库存-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!Array.isArray(imported.items) || !Array.isArray(imported.locations)) {
      throw new Error("文件格式不对");
    }
    state.data = normalizeInventoryData({ ...createInitialData(), ...imported });
    populateSettings();
    populateFormOptions();
    await persistData();
  } catch (error) {
    showToast(error.message || "导入失败");
  } finally {
    event.target.value = "";
  }
}

async function clearData() {
  const confirmed = confirm("确定清空本机全部数据吗？");
  if (!confirmed) return;
  const deletedItems = {};
  state.data.items.forEach((item) => {
    deletedItems[item.id] = new Date().toISOString();
  });
  state.data = { ...createInitialData(), deletedItems };
  populateSettings();
  populateFormOptions();
  await persistData();
}

function formatQuantity(item) {
  const value = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0;
  return `${value}${item.unit || ""}`;
}

function getLocationMeta(location) {
  if (!location) return { zone: "其他", note: "", updatedAt: "" };
  const meta = state.data.locationMeta?.[location] || {};
  return {
    zone: meta.zone || inferLocationZone(location, state.data.zones),
    note: meta.note || "",
    image: meta.image || "",
    updatedAt: meta.updatedAt || ""
  };
}

function getZoneMeta(zone) {
  const meta = state.data.zoneMeta?.[zone] || {};
  return {
    image: meta.image || "",
    updatedAt: meta.updatedAt || ""
  };
}

function inferLocationZone(location, zones = DEFAULT_ZONES) {
  const text = String(location || "");
  return zones.find((zone) => text.includes(zone)) || "其他";
}

function getLocationUpdatedAt(location) {
  const itemTimes = getItemsForLocation(location)
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .map((time) => new Date(time).getTime())
    .filter(Number.isFinite);
  const metaTime = new Date(getLocationMeta(location).updatedAt || 0).getTime();
  return new Date(Math.max(metaTime || 0, ...itemTimes, 0)).toISOString();
}

function formatDateShort(dateLike) {
  const time = new Date(dateLike);
  if (Number.isNaN(time.getTime()) || time.getFullYear() < 2000) return "未更新";
  return time.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}

function getCategoryColor(category) {
  return DEFAULT_CATEGORIES.find((cat) => cat.name === category)?.color || "#0f766e";
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("visible"), 1800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

async function initSync() {
  if (!SYNC_CONFIG?.supabaseUrl || !SYNC_CONFIG?.supabaseAnonKey || !SYNC_CONFIG?.householdId) {
    setSyncStatus("offline", "本机模式", "数据保存在这台设备的浏览器里。");
    return;
  }

  try {
    state.syncClient = createSupabaseSyncClient(
      SYNC_CONFIG.supabaseUrl,
      SYNC_CONFIG.supabaseAnonKey,
      SYNC_CONFIG.householdId
    );
    await syncNow();
    setSyncStatus("online", "云同步已启用", "两台手机会使用同一份家庭空间数据。");
  } catch (error) {
    setSyncStatus("offline", "同步未启用", error.message || "请检查 config.js。");
  }
}

async function syncNow() {
  if (!state.syncClient) {
    showToast("当前是本机模式");
    return;
  }

  try {
    const remote = await state.syncClient.load();
    state.data = mergeInventoryData(state.data, remote);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    populateSettings();
    populateFormOptions();
    render();
    await state.syncClient.save(state.data);
    showToast("已同步");
    setSyncStatus("online", "已同步", "云端和本机数据一致。");
  } catch (error) {
    setSyncStatus("offline", "同步失败", error.message || "稍后再试。");
    showToast("同步失败");
  }
}

function createSupabaseSyncClient(supabaseUrl, supabaseAnonKey, householdId) {
  const baseUrl = String(supabaseUrl || "").replace(/\/$/, "");
  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  return {
    async load() {
      const response = await fetch(
        `${baseUrl}/rest/v1/household_inventory?select=payload&id=eq.${encodeURIComponent(householdId)}&limit=1`,
        { headers }
      );
      if (!response.ok) {
        throw new Error(`读取失败 ${response.status}`);
      }
      const rows = await response.json();
      return rows[0]?.payload || null;
    },
    async save(payload) {
      const response = await fetch(`${baseUrl}/rest/v1/household_inventory?on_conflict=id`, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify({
          id: householdId,
          payload,
          updated_at: new Date().toISOString()
        })
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`保存失败 ${response.status}: ${text.slice(0, 120)}`);
      }
      return response.json().catch(() => null);
    }
  };
}

function mergeInventoryData(localData, remoteData) {
  if (!remoteData) return normalizeInventoryData({ ...localData });

  const base = createInitialData();
  const local = normalizeInventoryData({ ...base, ...localData });
  const remote = normalizeInventoryData({ ...base, ...remoteData });
  const localIsNewer = new Date(local.updatedAt || 0) >= new Date(remote.updatedAt || 0);
  const deletedItems = mergeDeletedItems(remote.deletedItems, local.deletedItems);
  const deletedLocations = mergeDeletedLocations(remote.deletedLocations, local.deletedLocations);
  const deletedZones = mergeDeletedZones(remote.deletedZones, local.deletedZones);
  const zones = mergeZones(remote.zones, local.zones, deletedZones, remote.locationMeta, local.locationMeta);
  const containers = mergeContainers(remote.containers, local.containers);
  const itemsById = new Map();

  [...remote.items, ...local.items].forEach((item) => {
    if (!item?.id) return;
    const existing = itemsById.get(item.id);
    if (!existing || new Date(item.updatedAt || 0) >= new Date(existing.updatedAt || 0)) {
      itemsById.set(item.id, item);
    }
  });

  const items = [...itemsById.values()].filter((item) => {
    const deletedAt = deletedItems[item.id];
    return !deletedAt || new Date(item.updatedAt || 0) > new Date(deletedAt);
  });

  return normalizeInventoryData({
    ...base,
    householdName: localIsNewer ? local.householdName : remote.householdName,
    memberName: local.memberName || remote.memberName || "",
    locations: [...new Set([...remote.locations, ...local.locations])],
    zones,
    locationMeta: mergeLocationMeta(remote.locationMeta, local.locationMeta, zones),
    zoneMeta: mergeZoneMeta(remote.zoneMeta, local.zoneMeta, zones),
    containers,
    items: items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    deletedItems,
    deletedLocations,
    deletedZones,
    updatedAt: new Date().toISOString()
  });
}

function mergeDeletedItems(remoteDeleted = {}, localDeleted = {}) {
  const merged = {};
  [...Object.entries(remoteDeleted), ...Object.entries(localDeleted)].forEach(([id, deletedAt]) => {
    if (!merged[id] || new Date(deletedAt || 0) > new Date(merged[id] || 0)) {
      merged[id] = deletedAt;
    }
  });
  return merged;
}

function mergeDeletedLocations(remoteDeleted = {}, localDeleted = {}) {
  const merged = {};
  [...Object.entries(remoteDeleted), ...Object.entries(localDeleted)].forEach(([location, deletedAt]) => {
    if (!location) return;
    if (!merged[location] || new Date(deletedAt || 0) > new Date(merged[location] || 0)) {
      merged[location] = deletedAt;
    }
  });
  return merged;
}

function mergeDeletedZones(remoteDeleted = {}, localDeleted = {}) {
  const merged = {};
  [...Object.entries(remoteDeleted), ...Object.entries(localDeleted)].forEach(([zone, deletedAt]) => {
    if (!zone) return;
    if (!merged[zone] || new Date(deletedAt || 0) > new Date(merged[zone] || 0)) {
      merged[zone] = deletedAt;
    }
  });
  return merged;
}

function mergeZones(remoteZones = [], localZones = [], deletedZones = {}, remoteMeta = {}, localMeta = {}) {
  const metaZones = [...Object.values(remoteMeta || {}), ...Object.values(localMeta || {})]
    .map((meta) => meta?.zone)
    .filter(Boolean);
  return [...new Set([...DEFAULT_ZONES, ...remoteZones, ...localZones, ...metaZones])]
    .filter(Boolean)
    .filter((zone) => !deletedZones[zone]);
}

function mergeLocationMeta(remoteMeta = {}, localMeta = {}, zones = DEFAULT_ZONES) {
  const merged = {};
  [...Object.entries(remoteMeta), ...Object.entries(localMeta)].forEach(([location, meta]) => {
    if (!location) return;
    const existing = merged[location];
    if (!existing || new Date(meta?.updatedAt || 0) >= new Date(existing?.updatedAt || 0)) {
      merged[location] = {
        zone: meta?.zone || inferLocationZone(location, zones),
        note: meta?.note || "",
        image: meta?.image || "",
        updatedAt: meta?.updatedAt || new Date().toISOString()
      };
    }
  });
  return normalizeLocationMeta(Object.keys(merged), merged, zones);
}

function mergeZoneMeta(remoteMeta = {}, localMeta = {}, zones = DEFAULT_ZONES) {
  const merged = {};
  [...Object.entries(remoteMeta), ...Object.entries(localMeta)].forEach(([zone, meta]) => {
    if (!zone) return;
    const existing = merged[zone];
    if (!existing || new Date(meta?.updatedAt || 0) >= new Date(existing?.updatedAt || 0)) {
      merged[zone] = {
        image: meta?.image || "",
        updatedAt: meta?.updatedAt || new Date().toISOString()
      };
    }
  });
  return normalizeZoneMeta([...zones, ...Object.keys(merged)], merged);
}

function mergeContainers(remoteContainers = [], localContainers = []) {
  const merged = new Map();
  [...upgradeContainers(remoteContainers), ...upgradeContainers(localContainers)].forEach((container) => {
    if (!container?.id) return;
    merged.set(container.id, { ...container });
  });
  const ordered = DEFAULT_CONTAINERS.map((container) => merged.get(container.id) || container);
  [...merged.values()].forEach((container) => {
    if (!ordered.some((entry) => entry.id === container.id)) ordered.push(container);
  });
  return ordered;
}

function setSyncStatus(mode, title, detail) {
  const dot = els.syncStatusCard.querySelector(".sync-dot");
  dot.classList.toggle("online", mode === "online");
  els.syncStatusText.textContent = title;
  els.syncStatusDetail.textContent = detail;
}
