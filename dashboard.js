const orders = [
  { id: "AR-1028", date: "Oct 15, 2026", name: "Aarav Mehta", initials: "AM", email: "aarav.m@example.com", products: "The Form Tote", items: 1, total: 2490, status: "Processing", color: ["#efe1d6", "#855a43"] },
  { id: "AR-1027", date: "Oct 15, 2026", name: "Mira Kapoor", initials: "MK", email: "mira.k@example.com", products: "Daytrip Crossbody", items: 1, total: 1890, status: "Processing", color: ["#e5e7da", "#65704f"] },
  { id: "AR-1026", date: "Oct 14, 2026", name: "Rohan Shah", initials: "RS", email: "rohan.s@example.com", products: "Everywhere Wallet + Pouch", items: 2, total: 1780, status: "Shipped", color: ["#e6e1ee", "#74628b"] },
  { id: "AR-1025", date: "Oct 14, 2026", name: "Anaya Desai", initials: "AD", email: "anaya.d@example.com", products: "Weekender Duffel", items: 1, total: 3290, status: "Delivered", color: ["#e8d9d1", "#8d5d4c"] },
  { id: "AR-1024", date: "Oct 13, 2026", name: "Kabir Joshi", initials: "KJ", email: "kabir.j@example.com", products: "The Form Tote + Wallet", items: 2, total: 3480, status: "Delivered", color: ["#dce8e5", "#50776b"] },
  { id: "AR-1023", date: "Oct 13, 2026", name: "Tara Nair", initials: "TN", email: "tara.n@example.com", products: "On-the-Go Bottle", items: 1, total: 690, status: "Shipped", color: ["#f0e4d0", "#96774c"] },
  { id: "AR-1022", date: "Oct 12, 2026", name: "Dev Patel", initials: "DP", email: "dev.p@example.com", products: "Soft Structure Sling", items: 1, total: 1490, status: "Delivered", color: ["#eadce0", "#8a5767"] },
  { id: "AR-1021", date: "Oct 12, 2026", name: "Ira Kulkarni", initials: "IK", email: "ira.k@example.com", products: "Daytrip Crossbody + Pouch", items: 2, total: 2680, status: "Processing", color: ["#dce5ef", "#526c89"] }
];

const salesPeriods = {
  "Last 7 days": {
    total: 48290,
    labels: ["Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15"],
    values: [4200, 6800, 5100, 8900, 7300, 8400, 7590],
    max: 10000
  },
  "Last 30 days": {
    total: 184760,
    labels: ["Sep 19", "Sep 24", "Sep 29", "Oct 4", "Oct 9", "Oct 12", "Oct 15"],
    values: [13200, 19800, 16800, 24600, 22100, 28700, 29560],
    max: 35000
  },
  "This year": {
    total: 728430,
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Oct", "Today"],
    values: [25000, 48000, 73000, 92000, 138000, 170000, 182430],
    max: 200000
  }
};

const orderBody = document.querySelector("#orders-body");
const orderSearch = document.querySelector("#order-search");
const statusFilter = document.querySelector("#status-filter");
const noOrders = document.querySelector("#no-orders");
const toast = document.querySelector("#toast");
let activePeriod = "Last 7 days";
let toastTimeout;

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function renderOrders() {
  const query = orderSearch.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const visibleOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.name} ${order.email} ${order.products}`.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  orderBody.innerHTML = visibleOrders.map((order) => {
    const statusClass = `status-${order.status.toLowerCase()}`;
    return `
      <tr>
        <td><input class="order-checkbox" type="checkbox" aria-label="Select order ${order.id}"></td>
        <td class="order-id">${order.id}</td>
        <td>${order.date}</td>
        <td><div class="customer-cell"><span class="customer-avatar" style="--avatar-bg:${order.color[0]};--avatar-text:${order.color[1]}">${order.initials}</span><span class="customer-name">${order.name}</span></div></td>
        <td>${order.products} <span class="product-count">· ${order.items} item${order.items === 1 ? "" : "s"}</span></td>
        <td class="order-total-cell">${formatPrice(order.total)}</td>
        <td><span class="status-pill ${statusClass}">${order.status}</span></td>
        <td><button class="row-menu" type="button" data-order="${order.id}" aria-label="More actions for ${order.id}">···</button></td>
      </tr>
    `;
  }).join("");

  noOrders.hidden = visibleOrders.length > 0;
  document.querySelector("#table-summary").textContent = visibleOrders.length
    ? `Showing 1–${visibleOrders.length} of ${visibleOrders.length} orders`
    : "Showing 0 orders";
  document.querySelector("#order-total").textContent = visibleOrders.length;
  document.querySelector("#select-all").checked = false;
}

function renderChart(periodName) {
  const period = salesPeriods[periodName];
  activePeriod = periodName;
  document.querySelector("#chart-total").textContent = formatPrice(period.total);
  document.querySelector("#chart-area").setAttribute("aria-label", `Sales chart for ${periodName.toLowerCase()}`);
  document.querySelector("#chart-area").innerHTML = period.values.map((value, index) => {
    const height = Math.max(4, (value / period.max) * 100);
    return `
      <div class="chart-day ${index === period.values.length - 1 ? "today" : ""}">
        <span class="chart-tooltip" style="--height:${height}%">${formatPrice(value)}</span>
        <div class="chart-bar-track"><div class="chart-bar" style="height:${height}%"></div></div>
        <span class="chart-label">${period.labels[index]}</span>
      </div>
    `;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function downloadOrders() {
  const columns = ["Order", "Date", "Customer", "Email", "Products", "Items", "Total INR", "Status"];
  const rows = orders.map((order) => [
    order.id,
    order.date,
    order.name,
    order.email,
    order.products,
    order.items,
    order.total,
    order.status
  ]);
  const csv = [columns, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const file = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "arshiyan-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Your order report is ready.");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  document.querySelector("#theme-toggle").setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  document.querySelector("#theme-toggle").title = `Switch to ${nextTheme} theme`;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#161815" : "#f6f5f2";
  try {
    localStorage.setItem("arshiyan-dashboard-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.", error);
  }
}

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

orderSearch.addEventListener("input", renderOrders);
statusFilter.addEventListener("change", renderOrders);
document.querySelector("#export-orders").addEventListener("click", downloadOrders);
document.querySelector("#select-all").addEventListener("change", (event) => {
  document.querySelectorAll(".order-checkbox").forEach((checkbox) => {
    checkbox.checked = event.currentTarget.checked;
  });
});
document.querySelector("#chart-period").addEventListener("click", () => {
  const options = Object.keys(salesPeriods);
  const nextIndex = (options.indexOf(activePeriod) + 1) % options.length;
  const nextPeriod = options[nextIndex];
  document.querySelector("#chart-period").innerHTML = `${nextPeriod} <span>⌄</span>`;
  document.querySelector("#chart-period").setAttribute("aria-label", `Chart period: ${nextPeriod}`);
  renderChart(nextPeriod);
});
document.querySelector("#date-range-button").addEventListener("click", () => {
  const options = Object.keys(salesPeriods);
  const nextIndex = (options.indexOf(activePeriod) + 1) % options.length;
  const nextPeriod = options[nextIndex];
  document.querySelector("#date-range-button").innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></svg>${nextPeriod} <span class="chevron">⌄</span>`;
  document.querySelector("#chart-period").innerHTML = `${nextPeriod} <span>⌄</span>`;
  document.querySelector("#chart-period").setAttribute("aria-label", `Chart period: ${nextPeriod}`);
  renderChart(nextPeriod);
});
document.querySelector("#orders-body").addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-order]");
  if (actionButton) showToast(`${actionButton.dataset.order} · Order details are up to date.`);
});
document.querySelector("#previous-page").addEventListener("click", () => showToast("You're on the first page."));
document.querySelector("#next-page").addEventListener("click", () => showToast("You're viewing all sample orders."));
document.querySelector("#profile-button").addEventListener("click", () => showToast("Signed in as Arshiyan, store owner."));

const mobileMenu = document.querySelector("#mobile-menu");
mobileMenu.addEventListener("click", () => {
  const sidebar = document.querySelector("#sidebar");
  const open = sidebar.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  const sidebar = document.querySelector("#sidebar");
  if (sidebar.classList.contains("is-open") && !sidebar.contains(event.target) && !mobileMenu.contains(event.target)) {
    sidebar.classList.remove("is-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }
});

const today = new Date();
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(today);
document.querySelector("#current-year").textContent = today.getFullYear();

try {
  const storedTheme = localStorage.getItem("arshiyan-dashboard-theme");
  if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
} catch (error) {
  console.warn("Theme preference could not be loaded.", error);
}

renderOrders();
renderChart(activePeriod);
