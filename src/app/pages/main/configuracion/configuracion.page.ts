import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  asignaturas = [
    { sigla: 'ARQ101', profesor: 'Prof. Nombre María Fernanda López García', titulo: 'Arquitectura', mostrarDetalle: false },
    { sigla: 'CSW102', profesor: 'Prof. Nombre Juan Carlos Ramírez Torres', titulo: 'Calidad de Software', mostrarDetalle: false },
    { sigla: 'APP103', profesor: 'Prof. Nombre Ana Sofía Hernández Pérez', titulo: 'Aplicaciones Móviles', mostrarDetalle: false },
    { sigla: 'EST104', profesor: 'Prof. Nombre Carlos Eduardo Martínez Rivera', titulo: 'Estadística Descriptiva', mostrarDetalle: false },
    { sigla: 'ETW105', profesor: 'Prof. Nombre Laura Isabel González Morales', titulo: 'Ética para el Trabajo', mostrarDetalle: false },
  ];

  toggleDetalle(asignatura: any, event?: Event): void {
    // Evitar que el evento del botón haga colapsar la tarjeta
    if (event) {
      event.stopPropagation();
    }
    asignatura.mostrarDetalle = !asignatura.mostrarDetalle;
  }
  ngOnInit(): void {
    // Puedes agregar lógica aquí si es necesario.
    console.log('ConfiguracionPage inicializado.');
  }

}
