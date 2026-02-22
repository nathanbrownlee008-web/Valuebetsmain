const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const datasets = [
  { name: "Value Bets", table: "value_bets" },
  { name: "Bet History", table: "bet_history" },
  { name: "Betting Strategies", table: "strategies" }
];

let currentData = [];

const tabsEl = document.getElementById("tabs");
const table = document.getElementById("tbl");
const thead = table.querySelector("thead");
const tbody = table.querySelector("tbody");
const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");

function buildTabs() {
  tabsEl.innerHTML = "";
  datasets.forEach(ds => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = ds.name;
    btn.onclick = () => loadTable(ds.table);
    tabsEl.appendChild(btn);
  });
}

async function loadTable(tableName) {
  statusEl.textContent = "Loading...";
  const { data, error } = await client.from(tableName).select("*");

  if (error) {
    statusEl.textContent = "Error loading data";
    console.error(error);
    return;
  }

  currentData = data || [];
  renderTable(currentData);
}

function renderTable(data) {
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!data.length) {
    countEl.textContent = "0 rows";
    statusEl.textContent = "No data";
    return;
  }

  const columns = Object.keys(data[0]);

  const trHead = document.createElement("tr");
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  data.forEach(row => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  countEl.textContent = data.length + " rows";
  statusEl.textContent = "Live Supabase data";
}

buildTabs();
loadTable("value_bets");
