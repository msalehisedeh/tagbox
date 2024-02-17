import { Injectable } from '@angular/core';

@Injectable()
export class TagTransfer {
    
    private data: any = {};

    constructor() {}

    setData(name: string, value: any){
        this.data[name] = value;
    }

    getData(name: string) {
        return this.data[name];
    }
            
}