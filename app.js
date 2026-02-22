
const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadTable() {
  const status = document.getElementById("status");
  const count = document.getElementById("count");
  const tbody = document.querySelector("#tbl tbody");
  const thead = document.querySelector("#tbl thead");

  status.textContent = "Loading...";

  const { data, error } = await client
    .from("value_bets")
    .select("*")
    .order("bet_date", { ascending: false });

  if (error) {
    console.error(error);
    status.textContent = "Error loading data";
    return;
  }

  if (!data || data.length === 0) {
    status.textContent = "No data found";
    count.textContent = "0 rows";
    return;
  }

  status.textContent = "Live Supabase data";
  count.textContent = data.length + " rows";

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const columns = Object.keys(data[0]);

  const headerRow = document.createElement("tr");
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.forEach(row => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

loadTable();
