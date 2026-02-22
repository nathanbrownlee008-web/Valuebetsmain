
const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

const state = {
  datasets: [],
  current: null,
  raw: [],
  filtered: []
};

function buildTabs(){
  const tabs = $("tabs");
  tabs.innerHTML = "";
  state.datasets.forEach(d=>{
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = d.name;
    btn.onclick = () => loadDataset(d.slug);
    tabs.appendChild(btn);
  });
}

async function loadDataset(slug){
  state.current = slug;
  $("status").textContent = "Loading...";

  let table = "";

  if(slug === "value-bets"){
    table = "value_bets";
  }

  if(slug === "bet-history"){
    table = "bet_history";
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("bet_date",{ascending:false});

  if(error){
    console.error(error);
    $("status").textContent = "Error loading data";
    return;
  }

  state.raw = data || [];
  state.filtered = [...state.raw];
  render();
}

function render(){
  const tbody = $("tbl").querySelector("tbody");
  const thead = $("tbl").querySelector("thead");
  tbody.innerHTML = "";
  thead.innerHTML = "";

  if(state.filtered.length === 0){
    $("count").textContent = "0 rows";
    $("status").textContent = "No data found";
    return;
  }

  const columns = Object.keys(state.filtered[0]);

  const headerRow = document.createElement("tr");
  columns.forEach(col=>{
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  state.filtered.forEach(row=>{
    const tr = document.createElement("tr");
    columns.forEach(col=>{
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  $("count").textContent = state.filtered.length + " rows";
  $("status").textContent = "Live Supabase data";
}

async function init(){
  const res = await fetch("datasets.json");
  state.datasets = await res.json();
  buildTabs();
  loadDataset("value-bets");
}

init();
