import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customtitlecase' }) 
export class CustomTitleCasePipe implements PipeTransform {

    transform(value: string): any {
        if (value == null) { 
            return ''; 
        } 
        let park: string = "" + value; 
        park = park.toLowerCase();
        var words: string[] = park.split(" "); 
        let result: string = '';

        for (let i = 0; i < words.length; i++) { 
            result = result + ' ' + this.capitalize(words[i]); //also if empty re-add the space
        } 
        return result;
    }

    private capitalize(toCapitalize: string): string { 
        if (toCapitalize != null) { 
            if (toCapitalize.length <= 1) { 
                return toCapitalize.toUpperCase(); 
            } 
            let capitalized = toCapitalize.charAt(0).toUpperCase() + toCapitalize.slice(1); 
            return capitalized; 
        } 
        return ''; 
    }

}