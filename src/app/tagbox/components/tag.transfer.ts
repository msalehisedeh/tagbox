import { Injectable, Inject  } from '@angular/core';

@Injectable()
export class TagTransfer {
    
    private data: any = {};

    constructor() {}

    setData(name, value){
        this.data[name] = value;
    }

    getData(name) {
        return this.data[name];
    }
            
}