import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    files: any[] = [];
    email: string = '';
    validityTime: number = 0; // time limit of link
    selectedFile: string = '';
    username: string = "";

    isModalOpen: boolean =  false;

    // For searchng
    name: string = "";
    filteredFiles: any[] = [];

    // For tooltip
    @ViewChild('tooltip') tooltipElement: ElementRef | undefined;
    tooltipMessage: string = "";

    constructor(private router: Router, private dataService: DataService) {}

    ngOnInit() 
    {
        this.fetchData();
        this.removeToolTip();
    }

    // Searching and Sorting functions
    searchFiles() 
    {
        // Filter the files based on the search term
        this.filteredFiles = this.files.filter(file => 
        {
            const searchTerm = this.name.toLowerCase(); // Make search case-insensitive
      
            // Check if the search term exists
            return file.uploded_file_name.toLowerCase().includes(searchTerm) 
            || file.uploaded_file_description.toLowerCase().includes(searchTerm)
            || file.uploaded_file_date.toLowerCase().includes(searchTerm)
            || file.uploaded_file_category.toLowerCase().includes(searchTerm);
        });
    }

    sortFiles(sortBy: string) 
    {
        // Implement sorting logic based on the sortBy parameter
        if (sortBy === 'name') 
        {
            this.filteredFiles.sort((a, b) => 
            {
                const nameA = a.uploded_file_name.toLowerCase();
                const nameB = b.uploded_file_name.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } 
        else if (sortBy === 'description') 
        {
            // Similar logic for sorting by description
            this.filteredFiles.sort((a, b) => 
            {
                const descA = a.uploaded_file_description.toLowerCase();
                const descB = b.uploaded_file_description.toLowerCase();
                return descA.localeCompare(descB);
            });
        } 
        else if (sortBy === 'date') 
        {
            // Sorting by uploaded date
            this.filteredFiles.sort((a, b) =>
            {
                const dateA = a.uploaded_file_date.toLowerCase();
                const dateB = b.uploaded_file_date.toLowerCase();
                return dateA.localeCompare(dateB);
            });
        } 
        else if (sortBy === 'category') 
        {
            // Similar logic for sorting by category
            this.filteredFiles.sort((a, b) => 
            {
                const catA = a.uploaded_file_category.toLowerCase();
                const catB = b.uploaded_file_category.toLowerCase();
                return catA.localeCompare(catB);
            });
        }
      }

    onKeyUp(event: KeyboardEvent)
    {
        // keyCode 13 is "enter"
        if (event.keyCode === 13)
        {
            this.searchFiles();
        }
    }

    updateTooltipPosition(event: MouseEvent, message: string) {
        event.stopPropagation();
      
        if (this.tooltipElement) {
          this.tooltipElement.nativeElement.style.opacity = '1'; // Show the tooltip
        }
      
        this.tooltipMessage = message; // Update the tooltip content
      
        // Get cursor position relative to the document
        const cursorX = event.clientX;
        const cursorY = event.clientY;
      
        // Calculate tooltip position to avoid going off-screen (optional)
        let left = cursorX + 10; // Add an offset to position it slightly right of the cursor
        let top = cursorY + 10; // Add an offset to position it below the cursor
      
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const tooltipWidth = this.tooltipElement ? this.tooltipElement.nativeElement.offsetWidth : 0;
        const tooltipHeight = this.tooltipElement ? this.tooltipElement.nativeElement.offsetHeight : 0;
      
        // Check for off-screen positioning (optional)
        if (left + tooltipWidth > windowWidth) {
          left = cursorX - tooltipWidth - 10; // Position to the left of the cursor
        }
      
        if (top + tooltipHeight > windowHeight) {
          top = cursorY - tooltipHeight - 10; // Position above the cursor
        }
      
        // Set tooltip position
        if (this.tooltipElement) {
          this.tooltipElement.nativeElement.style.left = `${left}px`;
          this.tooltipElement.nativeElement.style.top = `${top}px`;
        }
      }

    removeToolTip() 
    {
        if (this.tooltipElement) 
        {
            this.tooltipElement.nativeElement.style.opacity = '0';
        }
    }

    // File data fetching functions
    fetchData = async () =>
    {
        const rec_dat = await fetch("http://127.0.0.1:4000/list",
        {
            method: 'GET',
            credentials: 'include'
        });

        if(rec_dat.status === 200){
            const final_data = await rec_dat.json();

            this.files = final_data.all_files;
            this.filteredFiles = this.files;
            this.username = final_data.f_name;
        }
        else
        {
            alert("Files couldn't be retrieved");
        }
    }

    deleteFile = async (fileName: string) =>
    {
        const obj = {main_key: fileName};
        const del_command = await fetch("http://127.0.0.1:4000/delete", {
                method: "POST",
                credentials: 'include',
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify(obj)
        });
        if(del_command.status === 200)
        {
            const message = await del_command.json();
            console.log(message.resp);
            location.reload();
        }
        else
        {
            alert("Error while deleting file");
        }
    }

    viewFile(file: string) 
    {
        this.dataService.sendData(file, this.username);
        this.router.navigate(['/file-viewer']);
    }

    downloadFile = async (file: any, fileName: string) => 
    {
        const rec_link = await fetch("http://127.0.0.1:4000/download", 
        {
            method: 'POST',
            credentials: 'include',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({get_key: fileName})
        });
      
        if (rec_link.status === 200) 
        {
            const final_link = await rec_link.json();
            const downloadUrl = final_link.resp;
        
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
        
            // Create a temporary downloadable URL
            const downloadLink = URL.createObjectURL(blob);
        
            // Simulate click with download attribute and force download
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = downloadLink;
            downloadAnchor.download = this.getFilenameFullname(file.uploded_file_name);
            console.log(downloadLink);
            downloadAnchor.target = '_blank';
            downloadAnchor.setAttribute('download', ''); // Force download (apparently experimental, works tho)
        
            downloadAnchor.click(); // Another force
        
            // Revoke the temporary URL after download
            setTimeout(() => URL.revokeObjectURL(downloadLink), 1000); // After a short delay
        } 
        else 
        {
            console.log("Error downloading file:", rec_link.status);
        }
    };

    getFilenameFullname(fullname: string)
    {
        const parts = fullname.split('.');
        return parts[0];
    }

    extractPath(url: string): string {
        const regex = /\/([a-f0-9-]+)$/i;
        const match = url.match(regex);
        if (match) {
            return match[0];
        } else {
            return '';
        }
    }

    shareFile(fileKey: string) 
    {
        this.selectedFile = fileKey;
        this.isModalOpen = true;
    }

    closeModal()
    {
        this.isModalOpen = false;
    }

    onEmailSent(data: { email: string, validityTime: number })
    {
        console.log('Email:', data.email);
        console.log('Validity:', data.validityTime);

        this.email = data.email;
        this.validityTime = data.validityTime;

        this.sendEmail(this.selectedFile);
    }

    sendEmail = async (fileKey: any) => 
    {
        const email_id = this.email;
        const valid_time = this.validityTime;
    
        try 
        {
            const send_mail = await fetch("http://127.0.0.1:4000/share_link", {
                method: "POST",
                credentials: 'include',
                headers: 
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ r_id: email_id, v_time: valid_time, get_key: fileKey })
            });
    
            if (send_mail.ok) 
            {
                const result = await send_mail.json();
                alert(result.resp);
            } 
            else 
            {
                alert("Failed to send email: " + send_mail.statusText);
            }
        } 
        catch (error) 
        {
            // Handle network errors or other exceptions
            console.error("An error occurred while sending email:", error);
            alert("Failed to send email. Please try again later.");
        }
    }
}
