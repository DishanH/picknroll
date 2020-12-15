import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OffcanvasService } from './core/shared/offcanvas.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('ageverify') privacyPopup: TemplateRef<any>;
  closeResult = false;
  public products: any;
  constructor(
    public offcanvasService: OffcanvasService,
    private modalService: NgbModal
  ) {}

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.open();
    // }, 3000);
  }

  open() {
    const content = this.privacyPopup;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          window.location.href = 'http://www.google.ca';
        },
        (reason) => {}
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
