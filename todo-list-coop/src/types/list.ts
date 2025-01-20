export interface List {
    codigo: string;
    nome: string;
    tarefas: Task[];
  }
  
  export interface Task {
    id: number;
    descricao: string;
    status: boolean;
  }
  