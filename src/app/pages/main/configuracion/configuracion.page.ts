import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importar AngularFireAuth

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  asignaturas: any[] = []; // Arreglo para almacenar las asignaturas
  uid: string = ''; // Para almacenar el uid del usuario logueado

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth // Inyectar AngularFireAuth
  ) {}

  ngOnInit(): void {
    // Obtener el UID del usuario logueado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid; // Asignar el UID del usuario logueado
        this.cargarAsignaturas(); // Cargar asignaturas después de obtener el UID
      }
    });
  }

  cargarAsignaturas(): void {
    if (!this.uid) {
      console.error('No hay usuario logueado');
      return;
    }

    // Ahora puedes usar el UID para obtener los horarios de este usuario
    this.firestore.collection('asignaturas').doc(this.uid).valueChanges().subscribe((data: any) => {
      if (data && data.clases) {
        this.asignaturas = data.clases.map((clase: any) => ({
          sigla: clase.sigla,
          profesor: clase.profesor,
          titulo: clase.titulo,
          asistencia: clase.asistencias,
          seccion: clase.seccion,
          mostrarDetalle: false,
        }));
      }
    });
  }

  toggleDetalle(asignatura: any, event?: Event): void {
    // Evitar que el evento del botón haga colapsar la tarjeta
    if (event) {
      event.stopPropagation();
    }
    asignatura.mostrarDetalle = !asignatura.mostrarDetalle;
  }
}
