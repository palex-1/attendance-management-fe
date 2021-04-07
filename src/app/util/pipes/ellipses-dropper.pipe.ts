import { Pipe } from "@angular/core";

const DEFAULT_MAX_SIZE_CHAR: number = 50;

@Pipe({
    name: 'ellipsesDropperPipe'
})
export class EllipsesDropperPipe {


    transform(value: string, size: number): string{
        if(value==null){
            return '';
        }
        let sizeToTruncate: number = size == null ? DEFAULT_MAX_SIZE_CHAR : size;
        if(value.length>sizeToTruncate){
            return value.substring(0, sizeToTruncate)+"...";
        }
        return value;
    }
}