// Chart helpers. All colors and fonts are derived from the live CSS custom
// properties so charts always match the active theme (dark/light) instead of
// carrying their own hardcoded palette.

function cssVar(name){
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function hexToRgba(hex, alpha){
  const h = hex.replace('#','');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${alpha})`;
}

function chartTheme(){
  const accent = cssVar('--accent') || '#ff9f0a';
  return {
    grid: cssVar('--line') || 'rgba(255,255,255,0.09)',
    text: cssVar('--muted') || '#8e8e93',
    line: accent,
    fill: hexToRgba(accent, 0.12),
    mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
  };
}

// Ordered categorical palette for multi-slice charts, pulled from the theme.
function chartPalette(){
  return ['--accent','--good','--blue','--pink','--steel','--warn','--red']
    .map(v => cssVar(v))
    .filter(Boolean);
}

function clearCanvas(ctx){
  ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
}

function drawLineChart(canvasId, labels, data, instanceRef){
  const theme = chartTheme();
  const ctx = document.getElementById(canvasId);
  if(!ctx) return null;
  if(instanceRef.current) instanceRef.current.destroy();
  if(typeof Chart === 'undefined' || data.length === 0){
    clearCanvas(ctx);
    return null;
  }
  instanceRef.current = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{
      data, borderColor: theme.line, backgroundColor: theme.fill,
      fill:true, tension:0.3, pointRadius:3, pointBackgroundColor: theme.line
    }]},
    options: {
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color: theme.text, font:{family: theme.mono, size:10} }, grid:{ color: theme.grid } },
        y:{ ticks:{ color: theme.text, font:{family: theme.mono, size:10} }, grid:{ color: theme.grid } }
      }
    }
  });
  return instanceRef.current;
}

function drawBarChart(canvasId, labels, data, instanceRef){
  const theme = chartTheme();
  const ctx = document.getElementById(canvasId);
  if(!ctx) return null;
  if(instanceRef.current) instanceRef.current.destroy();
  if(typeof Chart === 'undefined' || data.length === 0){
    clearCanvas(ctx);
    return null;
  }
  instanceRef.current = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{
      data, backgroundColor: hexToRgba(theme.line, 0.75),
      borderColor: theme.line, borderWidth: 1, borderRadius: 6
    }]},
    options: {
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color: theme.text, font:{family: theme.mono, size:10} }, grid:{ display:false } },
        y:{ ticks:{ color: theme.text, font:{family: theme.mono, size:10} }, grid:{ color: theme.grid }, beginAtZero:true }
      }
    }
  });
  return instanceRef.current;
}

function drawDoughnutChart(canvasId, labels, data, instanceRef){
  const theme = chartTheme();
  const palette = chartPalette();
  const ctx = document.getElementById(canvasId);
  if(!ctx) return null;
  if(instanceRef.current) instanceRef.current.destroy();
  if(typeof Chart === 'undefined' || data.length === 0){
    clearCanvas(ctx);
    return null;
  }
  instanceRef.current = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{
      data,
      backgroundColor: labels.map((_, i) => palette[i % palette.length]),
      borderColor: cssVar('--card') || '#1c1c1e',
      borderWidth: 2
    }]},
    options: {
      cutout: '62%',
      plugins:{
        legend:{
          position: 'right',
          labels:{ color: theme.text, font:{family: theme.mono, size:10}, boxWidth: 9, boxHeight: 9, usePointStyle: true, pointStyle: 'circle' }
        }
      }
    }
  });
  return instanceRef.current;
}

const volumeChartRef = { current: null };
const e1rmChartRef = { current: null };
const bwChartRef = { current: null };
const weeklyChartRef = { current: null };
const muscleChartRef = { current: null };
const measureChartRef = { current: null };
const cardioPaceChartRef = { current: null };
