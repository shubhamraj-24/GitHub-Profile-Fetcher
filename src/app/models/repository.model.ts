//Repository.model.ts

export interface Repository {
    id: number;
    name: string;
    html_url: string;
    description: string;
    topics: string[];
    owner: {      
      login: string; 
    };
  }
  