
const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

const state = {
  datasets: [],
  current: null,
  raw: [],
  filtered: [],
  columnsAll: [],
  columns: [],
  sortKey: null,
  sortDir: "asc"
};

function buildTabs(){
  const tabs = $("tabs");
  tabs.innerHTML = "";
  state.datasets.forEach(d=>{
    const b = document.createElement("button");
    b.className = "tab";
    b.textContent = d.name;
    b.onclick = () => loadDataset(d.slug);
    tabs.appendChild(b);
  });
}

async function loadDataset(slug){
  state.current = slug;
  $("status").textContent = "Loading...";

  if(slug === "value-bets"){
    const { data } = await supabase
      .from("bets")
      .select("*")
      .eq("type","value")
      .order("bet_date",{ascending:false});

    state.raw = data || [];
  }

  if(slug === "bet-history"){
    const { data } = await supabase
      .from("bets")
      .select("*")
      .eq("type","history")
      .order("bet_date",{ascending:false});

    state.raw = data || [];
  }

  state.filtered = [...state.raw];
  render();
}

function render(){
  const tbody = $("tbl").querySelector("tbody");
  tbody.innerHTML = "";
  state.filtered.forEach(r=>{
    const tr = document.createElement("tr");
    Object.values(r).forEach(val=>{
      const td = document.createElement("td");
      td.textContent = val ?? "";
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
