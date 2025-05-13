import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactsService } from '../../../Core/services/contacts.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';

interface Contact {
  id: number;
  name: string;
  country: string;
  phone: string;
  numberOfChildren: number;
  planChoice: string;
  brandName: string;
  course: string;
  city: string;
  sentAt: string;
  isContact: boolean;
}

@Component({
  selector: 'app-contacts-dashboard',
  imports: [CommonModule],
  templateUrl: './contacts-dashboard.component.html',
  styleUrl: './contacts-dashboard.component.css'
})
export class ContactsDashboardComponent implements OnInit, OnDestroy {
    contacts: Contact[] = [];
    displayedContacts: Contact[] = [];
    private subscriptions: Subscription = new Subscription();
    isGridView = true;

    // Pagination properties
    currentPage = 1;
    itemsPerPage = 15;
    totalPages = 1;

    constructor(
      private contactService: ContactsService,
    ) {}

    ngOnInit() {
      this.initContactsSubscription();
      this.initRealTimeUpdates();
    }



    // Update Contacts Every 2 Minutes

    private initContactsSubscription(): void {
      this.subscriptions.add(
        this.contactService.contacts$.subscribe({
          next: (res) => {
            this.contacts = res.reverse();
            this.updatePagination();
            console.log('Contacts updated:', this.contacts);
          },
          error: (error) => console.error('Error fetching contacts:', error),
        })
      );
    }

    private initRealTimeUpdates(): void {
      const realTimeUpdates$ = timer(0, 120000).pipe(
        switchMap(() => this.contactService.getContacts()),
        retry(1),
        share()
      );

      this.subscriptions.add(
        realTimeUpdates$.subscribe({
          next: (contacts) => this.contactService.contactsSubject.next(contacts),
          error: (error) => console.error('Error fetching contacts:', error),
        })
      );
    }



    //Toggle View
    toggleView(isGrid: boolean): void {
      this.isGridView = isGrid;
    }


    //Toggle Status For Contactes
    toggleContactStatus(contact: Contact) {
      const originalStatus = contact.isContact;
      contact.isContact = !contact.isContact;
      this.contactService.toggleContactStatus(contact.id).subscribe({
        next: () => {

        },
        error: () => {

          contact.isContact = originalStatus; // Revert on error

        },
      });
    }


    // Download Data Button Methods
    async  downloadExcel(): Promise<void> {
      const [{ utils, write }] = await Promise.all([
    import('xlsx')]);

      const worksheet = utils.json_to_sheet(this.contacts);
      const workbook= {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer: any = write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'contacts');
    }

    async saveAsExcelFile(buffer: any, fileName: string): Promise<void> {
      const { saveAs } = await import('file-saver');
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
       saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
    }


    // Refresh Data Button Method

    isLoading: boolean = false;
    refreshData(): void {
      this.isLoading = true;
      this.subscriptions.add(
        this.contactService.getContacts().subscribe({
          next: (contacts) => {
            this.contactService.contactsSubject.next(contacts);
            console.log('Data refreshed successfully');

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error refreshing contacts:', error);

            this.isLoading = false;
          },
        })
      );
    }


    // Pagination methods
    updatePagination(): void {
      this.totalPages = Math.ceil(this.contacts.length / this.itemsPerPage);
      this.currentPage = 1;
      this.updateDisplayedContacts();
    }

    updateDisplayedContacts(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedContacts = this.contacts.slice(startIndex, endIndex);
    }

    goToPage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateDisplayedContacts();
      }
    }

    nextPage(): void {
      this.goToPage(this.currentPage + 1);
    }

    prevPage(): void {
      this.goToPage(this.currentPage - 1);
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }

}
