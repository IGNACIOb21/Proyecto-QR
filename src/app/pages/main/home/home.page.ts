import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string | null = null;
  clasesDelUsuario: any[] = [];
  diaHoy: string = ''; // Variable para almacenar el día actual

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Obtener el día de la semana actual
    const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const hoy = new Date();
    this.diaHoy = diasDeLaSemana[hoy.getDay() - 1]; // Ajustamos el índice para que sea correcto

    const currentUser = getAuth().currentUser;
    if (currentUser) {
      this.firebaseService.getHorariosDelUsuario(currentUser.uid).then(data => {
        if (data) {
          // Filtramos las clases para mostrar solo las del día actual
          this.clasesDelUsuario = data.filter((clase: any) => clase.dia === this.diaHoy);
        }
      });
      this.userName = currentUser.displayName;
    }
  }
}
