import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UploadService } from '../../services/shared.service';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {
    @Input() loadingProgress: number = 0;
    loadingDuration: number = 1000;
    uploadedMessage: boolean = false;
    @Input() isVisible: boolean = false;

    constructor(private uploadService: UploadService) {}
    
    ngOnInit()
    {
        this.uploadService.uploadButtonClicked.subscribe(() => 
        {
            console.log("Should receive");
            this.startLoading();
          });
    }

    toggleVisibility() 
    {
      this.isVisible = !this.isVisible;
    }

    startLoading()
    {
        this.toggleVisibility();
        this.startLoadingAnimation();
    }

    startLoadingAnimation()
    {
        this.uploadedMessage = false;

        this.loadingDuration = 100;
        const interval = 10;
        const steps = this.loadingDuration / interval;
        const stepSize = 100 / steps;

        let currentStep = 0;

        const timer = setInterval(() =>
        {
            if (currentStep >= steps)
            {
                clearInterval(timer);
                this.uploadedMessage = true;
                this.startRemoveCountdown();
            }
            else
            {
                this.loadingProgress += stepSize;
                currentStep++;
            }
        }, interval);
    }

    startRemoveCountdown()
    {
        const duration = 5000;
        const interval = 10;
        const steps = duration / interval;

        let currentStep = 0;

        const timer = setInterval(() =>
        {
            if (currentStep >= steps)
            {
                clearInterval(timer);
                this.toggleVisibility();
                this.loadingProgress = 0;
            }
            else
            {
                currentStep++;
            }
        }, interval);
    }
}
