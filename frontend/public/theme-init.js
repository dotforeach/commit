// Aplica el tema guardado antes de que cargue la app (evita un destello claro en modo oscuro).
try {
  var t = localStorage.getItem('commit.theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
