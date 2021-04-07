export class StringUtils{
    
    public static nullOrEmpty(str: string): boolean{
        if(str==null){
            return true;
        }
        if(str.trim()==''){
            return true;
        }
        return false;
    }

    public static transformToNullIfWithespaceOrNullAndTrim(str: string): string{
        let park = StringUtils.trim(str);
        if(park==null || park==''){
            return null;
        }
        return str;
    }

    public static trim(str: string): string {
        if(str==null){
            return null;
        }
        return str.trim();
    }

    public static toUpperCase(str: string): string{
        if(str==null){
            return null;
        }
        return str.toUpperCase();
    }

    public static toLowerCase(str: string): string {
        if(str==null){
            return null;
        }
        return str.toLowerCase();
    }
}