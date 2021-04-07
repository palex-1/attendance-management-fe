import { Injectable } from '@angular/core';

@Injectable()
export class IdGenerationService {

  private id: number =  0;

  constructor() { }

  newId(): string {
    return 'app-id-'+this.id++;
  }
}
