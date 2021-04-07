export class OrderEvent{
    private sortBy: string;
    private dir: string;

    constructor(sortBy ?: string, dir ?: string){
        this.setSortBy(sortBy);
        this.dir = dir;
    }

    resetSortByDir(){
        this.dir = null;
    }

    setSortBy(value: string): void{
        this.sortBy = value;
    }

    getSortBy(): string{
        return this.sortBy;
    }

    setDesc(): void{
        this.dir = "asc";
    }

    setAsc(): void{
        this.dir = "desc";
    }

    getDir(): string{
        return this.dir;
    }
}