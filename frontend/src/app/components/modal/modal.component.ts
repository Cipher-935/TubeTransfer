import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent 
{
    @Input() isModalOpen: boolean = false;

    recieverEmail: string = "";
    validityTime: number = 0;

    @Output() sendEmail = new EventEmitter<any>();
    @Output() closeModal = new EventEmitter<any>();

    closeTheModal(): void 
    {
        this.closeModal.emit();
    }

    onSendClick()
    {
        const email = this.recieverEmail;
        const validityTime = this.validityTime;
        console.log(validityTime);
        this.sendEmail.emit({ email, validityTime });
        this.closeTheModal();
    }
}
