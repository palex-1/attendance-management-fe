import { Injectable } from "@angular/core";



@Injectable()
export class StandardValidatorService{
    
    public static NOME_MIN_SIZE:number = 1;
    public static NOME_MAX_SIZE:number = 50;

    
    public static COGNOME_MIN_SIZE:number = 1;
    public static COGNOME_MAX_SIZE:number = 50;

    public static EMAIL_MIN_SIZE:number = 1;
    public static EMAIL_MAX_SIZE:number = 256;
    public static MAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    

    public static PIVA_AZIENDA_REGEX: RegExp= /^[0-9]{11}$/

    public static NOME_AZIENDA_MIN_SIZE:number = 1;
    public static NOME_AZIENDA_MAX_SIZE:number = 200;
    
    public static TELEFONO_REGEX: RegExp = /^[\/\-0-9 ]{3,16}$/;
    public static TELEFONO_MAX_SIZE:number = 16;
    
    public static INDIRIZZO_MAX_SIZE:number = 100;
    
    
    public static CITTA_MAX_SIZE:number = 50;
    
    
    public static PROVINCIA_MAX_SIZE:number = 50;
    
    
    public static CAP_MAX_SIZE:number = 5;
    public static CAP_REGEX: RegExp = /^[0-9]{5}$/;
    
    

    isValidNome(nome: string): boolean{
        if(nome==null || nome==undefined){
            return false;
        }
        let park: string = nome.trim();
        if(park.length < StandardValidatorService.NOME_MIN_SIZE || park.length > StandardValidatorService.NOME_MAX_SIZE ){
            return false;
        }
        return true;
    }

    isValidCognome(cognome: string): boolean{
        if(cognome==null || cognome==undefined){
            return false;
        }
        let park: string = cognome.trim();
        if(park.length < StandardValidatorService.COGNOME_MIN_SIZE || park.length > StandardValidatorService.COGNOME_MAX_SIZE ){
            return false;
        }
        return true;
    }

    isValidEmail(email: string): boolean{
        if(email==null || email==undefined){
            return false;
        }
        let park: string = email.trim();
        if(park.length < StandardValidatorService.EMAIL_MIN_SIZE || park.length > StandardValidatorService.EMAIL_MAX_SIZE ){
            return false;
        }

        return StandardValidatorService.MAIL_REGEX.test(park);

    }

   

    isValidNomeAzienda(azienda: string): boolean{
        if(azienda==null || azienda==undefined){
            return false;
        }
        let park: string = azienda.trim();
        if(park.length < StandardValidatorService.NOME_AZIENDA_MIN_SIZE || park.length > StandardValidatorService.NOME_AZIENDA_MAX_SIZE ){
            return false;
        }
        return true;
    }


    isValidTelefono(telefono: string): boolean{
        if(telefono==null || telefono==undefined){
            return false;
        }
        let park: string = telefono.trim();
        //console.log(park+" is "+StandardValidatorService.TELEFONO_REGEX.test(park));

        if( park.length >StandardValidatorService.TELEFONO_MAX_SIZE || !StandardValidatorService.TELEFONO_REGEX.test(telefono)){
            return false;
        }
        return true;
    }

    isValidIndirizzo(indirizzo: string): boolean{
        if(indirizzo==null || indirizzo==undefined){
            return false;
        }
        let park: string = indirizzo.trim();
        if( park.length > StandardValidatorService.INDIRIZZO_MAX_SIZE ){
            return false;
        }
        return true;

    }

    isValidCitta(citta: string): boolean{
        if(citta==null || citta==undefined){
            return false;
        }
        let park: string = citta.trim();
        if( park.length > StandardValidatorService.CITTA_MAX_SIZE ){
            return false;
        }
        return true;
    }

    isValidProvincia(provincia: string): boolean{
        if(provincia==null || provincia==undefined){
            return false;
        }
        let park: string = provincia.trim();
        if( park.length > StandardValidatorService.PROVINCIA_MAX_SIZE ){
            return false;
        }
        return true;
    }


    isValidCAP(cap: string): boolean{
        if(cap==null || cap==undefined){
            return false;
        }
        let park: string = cap.trim();
        if( park.length > StandardValidatorService.CAP_MAX_SIZE ){
            return false;
        }
        return StandardValidatorService.CAP_REGEX.test(cap);

    }






    



     isValidItalianPIVANumber(piva: string): boolean{
		if(piva==null){
            return false;
        }
		if(!StandardValidatorService.PIVA_AZIENDA_REGEX.test(piva)){
			return false;
		}
		
		return this.isValidCarattereControlloFormulaLuhn(piva);
	}
	
	
	
	/*calcola il carattere di controllo usando la formula di Luhn
	 * Sia X la somma delle prime cinque cifre in posizione dispari
       Sia Y la somma dei doppi delle cinque cifre in posizione pari, sottraendo 9 se il doppio della cifra è superiore a 9
		Sia T=(X+Y) mod 10 l'unità corrispondente alla somma dei numeri sopra calcolati
		Allora la cifra di controllo C = (10-T) mod 10
	 */
	
	private isValidCarattereControlloFormulaLuhn(iva: string): boolean{
		
		let X: number = this.sommaCifrePostoDispari(iva);
		let  Y: number = this.calcolaSommaDeiDoppiInPosizionePariSottraendo9SeIlDoppioDellaCifraSuperioreA9(iva);
		
		let T: number = (X + Y) % 10;
		
		let C: number = (10 - T) % 10;
		let x11: number = Number(iva.charAt(10)+"");

		return x11 == C;
	}
	
	
	
	private calcolaSommaDeiDoppiInPosizionePariSottraendo9SeIlDoppioDellaCifraSuperioreA9(iva: string): number{
		  let x2: number = Number(iva.charAt(1));
		  let x4: number = Number(iva.charAt(3));
		  let x6: number = Number(iva.charAt(5));
		  let x8: number = Number(iva.charAt(7));
		  let x10: number = Number(iva.charAt(9));
		  
		  let somma1: number = Number(this.calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x2));
		  let somma2: number = Number(this.calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x4));
		  let somma3: number = Number(this.calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x6));
		  let somma4: number = Number(this.calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x8));
          let somma5: number = Number(this.calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x10));
          
	      return somma1 + somma2 + somma3 + somma4 + somma5;	  
	}
	
	
	private calcolaSommaDeiDoppiSottraendo9SeIlDoppioDellaCifraSuperioreA9(x: number): number{
		if(x*2>9){
			  return x*2 -9; 
		}
	   	return x*2;
	}


	private sommaCifrePostoDispari(iva: string){
		let x1: number = Number(iva.charAt(0));
		let x3: number = Number(iva.charAt(2));
		let x5: number = Number(iva.charAt(4));
		let x7: number = Number(iva.charAt(6));
		let x9: number = Number(iva.charAt(8));
		return (x1+x3+x5+x7+x9);
	}


}