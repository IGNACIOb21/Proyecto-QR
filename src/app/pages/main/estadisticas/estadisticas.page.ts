import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Horario } from 'src/app/models/user.model';
import { getDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  horario: Horario[] = []; // Array para guardar el horario del estudiante
  horas: string[] = [
    "08:40", "09:30", "09:31", "10:15", "10:16", "11:00","11:01", "11:45", "11:46","12:30","12:31", 
    "13:15","13:16", "14:00", "14:01","14:45", "14:45", "15:30", "15:31"
  ]; // Horarios posibles
  dias: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]; // Días de la semana
  horarioPorDia: any = {}; // Almacenará las clases por día y hora
  clasesFaltantes: Horario[] = []; // Lista de clases faltantes
  rangosDeHoras: string[] = []; // Aquí almacenaremos los rangos de horas

  constructor(private firebaseSvc: FirebaseService) {}

  ngOnInit() {
    this.obtenerRangoDeHoras();
    this.obtenerHorario();
    this.organizarClasesPorDia();
    this.identificarClasesFaltantes();
  }

  // Función para agrupar y mostrar los horarios en formato "de [hora inicio] a [hora fin]"
  obtenerRangoDeHoras() {
    let rangos: string[] = [];
    for (let i = 0; i < this.horas.length - 1; i += 2) {
      let horaInicio = this.horas[i];
      let horaFin = this.horas[i + 1];
      rangos.push(`${horaInicio} a ${horaFin}`);
    }
    this.rangosDeHoras = rangos;
  }

  // Obtener horario de Firestore
  async obtenerHorario() {
    try {
      const userId = this.firebaseSvc.getAuth().currentUser?.uid;
      if (!userId) {
        console.error('Usuario no autenticado.');
        return;
      }

      const horarioDocRef = doc(this.firebaseSvc.db, 'horarios', userId);
      const horarioDoc = await getDoc(horarioDocRef);

      if (horarioDoc.exists()) {
        const horarioData = horarioDoc.data();
        if (horarioData && horarioData['clases']) {
          this.horario = horarioData['clases'] as Horario[];
        }
      }
    } catch (error) {
      console.error('Error al obtener el horario:', error);
    }
  }

  // Organiza las clases por día y hora
  organizarClasesPorDia() {
    this.dias.forEach((dia) => {
      this.horarioPorDia[dia] = {}; // Inicializa las clases por día
      this.horas.forEach((hora) => {
        this.horarioPorDia[dia][hora] = []; // Inicializa cada hora en ese día
      });
    });

    this.horario.forEach((clase) => {
      if (this.horarioPorDia[clase.dia] && this.horarioPorDia[clase.dia][clase.horaInicio]) {
        this.horarioPorDia[clase.dia][clase.horaInicio].push(clase);
      }
    });
  }

  // Identificar clases faltantes
  identificarClasesFaltantes() {
    this.clasesFaltantes = [];

    this.dias.forEach((dia) => {
      this.horas.forEach((hora) => {
        const clasesEnHora = this.horarioPorDia[dia][hora];
        if (clasesEnHora.length === 0) {
          const faltante = this.horario.find(
            (clase) => clase.dia === dia && clase.horaInicio === hora
          );
          if (faltante) {
            this.clasesFaltantes.push(faltante);
          }
        }
      });
    });

    console.log("Clases faltantes:", this.clasesFaltantes);
  }

  
  // Función para obtener las clases por día y hora
  getClasesPorDia(dia: string, hora: string): string {
    const clasesEnDia = this.horarioPorDia[dia]?.[hora];
    return clasesEnDia?.length > 0
      ? clasesEnDia.map((clase) => `${clase.asignatura} (${clase.sigla})`).join(', ')
      : 'Sin clases';
  }
  getClasesPorRango(dia: string, rango: string): string {
    const [horaInicio, horaFin] = rango.split(' a '); // Extraer las horas de inicio y fin
    const clasesEnRango = this.horario.filter(clase => {
      // Verifica si la clase está en el rango de hora especificado
      return clase.dia === dia && clase.horaInicio >= horaInicio && clase.horaInicio < horaFin;
    });
  
    return clasesEnRango.length > 0
      ? clasesEnRango.map((clase) => `${clase.asignatura} (${clase.sigla})`).join(', ')
      : 'Sin clases';
  }
  
}
