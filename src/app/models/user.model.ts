export interface User{
    uid:string,
    email:string,
    password:string,
    name:string,
    apellidoPaterno:string,
    apellidoMaterno:string,
    tipoUsuario:string
}

  
  export interface Horario {
    asignatura: string;
    sigla: string;
    profesor: string;
    dia: string;
    horaInicio: string;
    horaFin: string;
  }
  