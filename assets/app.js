async function loadApps() {
  const grid = document.getElementById('app-sections');
  try {
    const res = await fetch('data/apps.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('apps.json not found');
    const apps = await res.json();
    renderApps(apps);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state">
        Couldn't load <code>data/apps.json</code>. Make sure the file exists
        and this page is being served over http(s), not opened as a local file.
      </div>`;
    console.error(err);
  }
}

function renderApps(apps) {
  const container = document.getElementById('app-sections');
  container.innerHTML = '';

  if (!apps || apps.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        No apps listed yet. Add an entry to <code>data/apps.json</code> to get started.
      </div>`;
    return;
  }

  // Group by category, preserving first-seen order
  const categories = [];
  const byCategory = {};
  apps.forEach((app) => {
    const cat = app.category || 'Apps';
    if (!byCategory[cat]) {
      byCategory[cat] = [];
      categories.push(cat);
    }
    byCategory[cat].push(app);
  });

  categories.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'category';

    const heading = document.createElement('h2');
    heading.textContent = cat;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'grid';

    byCategory[cat].forEach((app) => grid.appendChild(buildTile(app)));

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function buildTile(app) {
  const tile = document.createElement('article');
  tile.className = 'tile';

  const icon = document.createElement('div');
  icon.className = 'tile-icon';
  if (app.icon) {
    const img = document.createElement('img');
    img.src = app.icon;
    img.alt = '';
    img.onerror = () => {
      icon.innerHTML = '';
      icon.textContent = (app.name || '?').trim().charAt(0).toUpperCase();
    };
    icon.appendChild(img);
  } else {
    icon.textContent = (app.name || '?').trim().charAt(0).toUpperCase();
  }

  const title = document.createElement('h3');
  title.textContent = app.name || 'Untitled app';

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = app.description || '';

  const meta = document.createElement('div');
  meta.className = 'meta';
  const bits = [app.version ? `v${app.version}` : null, app.size || null].filter(Boolean);
  meta.textContent = bits.join(' · ');

  const btn = document.createElement('a');
  btn.className = 'download-btn';
  btn.href = app.apk || '#';
  btn.setAttribute('download', '');
  btn.innerHTML = `<span>Download APK</span>`;

  tile.append(icon, title, desc, meta, btn);
  return tile;
}

/* ---------- Remote / D-pad arrow-key navigation ---------- */

function getFocusableTiles() {
  return Array.from(document.querySelectorAll('.download-btn'));
}

function buildRows(tiles) {
  const rows = [];
  let currentTop = null;
  let currentRow = [];
  tiles.forEach((t) => {
    const top = Math.round(t.getBoundingClientRect().top + window.scrollY);
    if (currentTop === null || Math.abs(top - currentTop) < 4) {
      currentRow.push(t);
      currentTop = top;
    } else {
      rows.push(currentRow);
      currentRow = [t];
      currentTop = top;
    }
  });
  if (currentRow.length) rows.push(currentRow);
  return rows;
}

document.addEventListener('keydown', (e) => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

  const tiles = getFocusableTiles();
  if (!tiles.length) return;

  const active = document.activeElement;
  let idx = tiles.indexOf(active);

  if (idx === -1) {
    tiles[0].focus();
    e.preventDefault();
    return;
  }

  const rows = buildRows(tiles);
  let r = -1, c = -1;
  for (let i = 0; i < rows.length && r === -1; i++) {
    const j = rows[i].indexOf(active);
    if (j !== -1) { r = i; c = j; }
  }
  if (r === -1) return;

  let targetR = r, targetC = c;
  if (e.key === 'ArrowRight') targetC += 1;
  if (e.key === 'ArrowLeft') targetC -= 1;
  if (e.key === 'ArrowDown') targetR += 1;
  if (e.key === 'ArrowUp') targetR -= 1;

  if (targetR < 0 || targetR >= rows.length) return;
  const targetRow = rows[targetR];
  targetC = Math.max(0, Math.min(targetC, targetRow.length - 1));
  const target = targetRow[targetC];
  if (target) {
    target.focus();
    e.preventDefault();
  }
});

loadApps();
