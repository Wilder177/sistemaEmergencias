
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('seccion-login').style.display = 'none';
  document.getElementById('seccion-registro').style.display = 'block';
});


document.getElementById('toggleClave').addEventListener('click', function () {
  const input = document.getElementById('clave');
  input.type = input.type === 'password' ? 'text' : 'password';
});


function seleccionarGravedad(valor) {
  document.getElementById('gravedad').value = valor;
  document.getElementById('gravedadSeleccionada').innerHTML = `
    <span class="color-box ${claseColor(valor)} me-2"></span> ${valor}
  `;
}


let pacientes = [];


document.getElementById('formularioPaciente').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const edad = parseInt(document.getElementById('edad').value);
  const genero = document.getElementById('genero').value;
  const documento = document.getElementById('documento').value.trim();
  const sintomas = document.getElementById('sintomas').value.trim();
  const gravedad = document.getElementById('gravedad').value;
  const tratamiento = document.getElementById('tratamiento').value.trim();
  const medicamentos = document.getElementById('medicamentos').value.trim();
  const examenes = document.getElementById('examenes').value;

  if (!nombre || !edad || !genero || !documento || !sintomas || !gravedad || !tratamiento || !medicamentos || !examenes) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  if (isNaN(edad) || edad <= 0) {
    alert('Edad inválida.');
    return;
  }

  if (documento.length < 5) {
    alert('Documento inválido.');
    return;
  }

  const paciente = { nombre, edad, genero, documento, sintomas, gravedad, tratamiento, medicamentos, examenes };
  pacientes.push(paciente);
  pacientes.sort((a, b) => gravedadOrden(b.gravedad) - gravedadOrden(a.gravedad));

  if (gravedad === 'Crítico') {
    alert('⚠️ Paciente en estado CRÍTICO registrado');
  }

  renderTabla();
  e.target.reset();
  document.getElementById('gravedadSeleccionada').innerText = 'Nivel de gravedad';
});


function gravedadOrden(nivel) {
  return { 'Crítico': 4, 'Urgente': 3, 'Moderado': 2, 'Leve': 1 }[nivel] || 0;
}

function claseColor(gravedad) {
  return {
    'Crítico': 'critico',
    'Urgente': 'urgente',
    'Moderado': 'moderado',
    'Leve': 'leve'
  }[gravedad] || '';
}

function claseGravedad(gravedad) {
  return {
    'Crítico': 'table-danger',
    'Urgente': 'table-warning',
    'Moderado': 'table-info',
    'Leve': 'table-success'
  }[gravedad] || '';
}

function renderTabla() {
  const tabla = document.getElementById('tablaPacientes').querySelector('tbody');
  tabla.innerHTML = '';

  let conteo = { Crítico: 0, Urgente: 0, Moderado: 0, Leve: 0 };

  pacientes.forEach((p, index) => {
    conteo[p.gravedad]++;
    const fila = tabla.insertRow();
    fila.classList.add(claseGravedad(p.gravedad));
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.edad}</td>
      <td>${p.genero}</td>
      <td>${p.documento}</td>
      <td>${p.sintomas}</td>
      <td><span class="color-box ${claseColor(p.gravedad)} me-1"></span> ${p.gravedad}</td>
      <td>${p.tratamiento}</td>
      <td>${p.medicamentos}</td>
      <td>${p.examenes}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${index})">Eliminar</button></td>
    `;
  });

  document.getElementById('contador').innerHTML = `
    <strong>Conteo:</strong> 
    Crítico: ${conteo.Crítico}, 
    Urgente: ${conteo.Urgente}, 
    Moderado: ${conteo.Moderado}, 
    Leve: ${conteo.Leve}
  `;
}

function eliminarPaciente(index) {
  if (confirm('¿Eliminar este paciente?')) {
    pacientes.splice(index, 1);
    renderTabla();
  }
}
