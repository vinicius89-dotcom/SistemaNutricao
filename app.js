import { emptyData, validateData, validDate, inRange, mealsForDay, totalForDay, recordWeight } from './model.js';
const $ = id => document.getElementById(id);
const key = 'meu-nutri-v1';
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const dateLabel = value => new Date(value + 'T12:00:00').toLocaleDateString('pt-BR');
let data = emptyData();
let storageHealthy = true;
try {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    const parsed = JSON.parse(raw);
    if (!validateData(parsed)) throw new Error('Dados inválidos');
    data = parsed;
  }
} catch {
  storageHealthy = false;
  $('status').textContent = 'Não foi possível ler os dados salvos. Os registros existentes foram preservados. Exporte ou recupere seus dados antes de continuar; alterações estão bloqueadas para evitar perda.';
}
const now = new Date();
$('day').value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
function save(next, message) {
  if (!storageHealthy) return false;
  try { localStorage.setItem(key, JSON.stringify(next)); data = next; $('status').textContent = message; render(); return true; }
  catch { $('status').textContent = 'Não foi possível salvar. Verifique o armazenamento do navegador. A alteração não foi aplicada.'; return false; }
}
function row(title, detail, remove) {
  const li = document.createElement('li');
  const text = document.createElement('div');
  const strong = document.createElement('strong'); strong.textContent = title;
  const small = document.createElement('small'); small.textContent = detail;
  text.append(strong, small);
  const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Excluir'; button.setAttribute('aria-label', `Excluir ${title}`); button.addEventListener('click', remove);
  li.append(text, button); return li;
}
function empty(list, message) { const li = document.createElement('li'); li.className = 'empty'; li.textContent = message; list.append(li); }
function render() {
  const day = $('day').value;
  const meals = mealsForDay(data, day);
  const total = totalForDay(data, day);
  $('total').textContent = `${number.format(total)} kcal`;
  $('count').textContent = `${meals.length} ${meals.length === 1 ? 'refeição' : 'refeições'}`;
  $('goal').value = data.goal;
  $('progress').value = Math.min(total / data.goal * 100, 100);
  $('progress-text').textContent = `${number.format(total / data.goal * 100)}% da meta diária registrada`;
  $('meals').replaceChildren();
  meals.forEach(m => $('meals').append(row(m.name, `${m.type} · ${number.format(m.calories)} kcal`, () => save({...data, meals: data.meals.filter(x => x.id !== m.id)}, 'Refeição excluída.'))));
  if (!meals.length) empty($('meals'), 'Nenhuma refeição nesta data. Que tal registrar a primeira?');
  const weights = [...data.weights].sort((a,b) => b.date.localeCompare(a.date));
  $('latest').textContent = weights.length ? `${number.format(weights[0].value)} kg` : '—';
  $('weight-date').textContent = weights.length ? dateLabel(weights[0].date) : 'Comece seu acompanhamento';
  $('weights').replaceChildren();
  weights.forEach(w => $('weights').append(row(`${number.format(w.value)} kg`, dateLabel(w.date), () => save({...data, weights: data.weights.filter(x => x.date !== w.date)}, 'Peso excluído.'))));
  if (!weights.length) empty($('weights'), 'Sua jornada começa com o primeiro registro.');
}
$('day').addEventListener('change', () => { if (validDate($('day').value)) render(); });
$('meal-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('meal-name').value.trim(), calories = Number($('calories').value), date = $('day').value;
  if (!name || !validDate(date) || !inRange(calories,20000,true)) { $('status').textContent = 'Preencha uma data, uma descrição e calorias válidas.'; return; }
  const saved = save({...data, meals: [...data.meals, {id: crypto.randomUUID(), date, name, calories, type: $('meal-type').value}]}, 'Refeição salva.');
  if (saved) { $('meal-name').value = ''; $('calories').value = ''; }
});
$('goal-form').addEventListener('submit', e => { e.preventDefault(); const goal = Number($('goal').value); if (inRange(goal,20000,true)) save({...data,goal}, 'Meta atualizada.'); });
$('weight-form').addEventListener('submit', e => { e.preventDefault(); const value = Number($('weight').value); if (validDate($('day').value) && inRange(value,600)) save(recordWeight(data,$('day').value,value), 'Peso salvo.'); else $('status').textContent = 'Informe uma data e um peso válidos.'; });
$('export').addEventListener('click', () => {
  let raw;
  try { raw = storageHealthy ? JSON.stringify(data,null,2) : localStorage.getItem(key); }
  catch { $('status').textContent = 'O navegador bloqueou o acesso aos dados. Verifique suas permissões de armazenamento.'; return; }
  if (!raw) { $('status').textContent = 'Não há dados disponíveis para exportar.'; return; }
  const url = URL.createObjectURL(new Blob([raw], {type:'application/json'})); const a = document.createElement('a'); a.href = url; a.download = `meu-nutri-${$('day').value}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
});
render();
