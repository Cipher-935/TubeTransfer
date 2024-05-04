import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable(
{
    providedIn: 'root'
})
export class DataService 
{
    private dataSubject = new BehaviorSubject<any>(null);
    data$ = this.dataSubject.asObservable();

    userName: string = "";

    sendData(data: any, inputUserName: string) 
    {
        this.dataSubject.next(data);
        this.userName = inputUserName;
    }
}
