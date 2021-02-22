import { Injectable } from "@angular/core";
import { of, Observable, Subject } from "rxjs";
import { MessageService } from "../../messages/message.service";

@Injectable({
  providedIn: "root",
})
export class ProductSearchService {

  term$ = new Subject<string>();
  constructor(private messageService: MessageService) {

  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add("ProductService: " + message);
  }
}
