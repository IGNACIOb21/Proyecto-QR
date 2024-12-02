export interface User{
    uid:string;
    email:string;
    password:string;
    name:string;
    apellidoPaterno:string;
    apellidoMaterno:string;
    tipoUsuario:string;
    carrera: string; // Campo opcional
    telefono: string; // Nuevo campo
}

  
  export interface Horario {
    asignatura: string;
    sigla: string;
    profesor: string;
    dia: string;
    horaInicio: string;
    horaFin: string;
  }

  export interface EscanerQR{
    uid:string,
    EscanerQR:string
  }