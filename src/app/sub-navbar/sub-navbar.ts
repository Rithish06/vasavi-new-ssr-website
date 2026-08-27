import { Component, DOCUMENT, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sub-navbar',
  imports: [RouterModule],
  templateUrl: './sub-navbar.html',
  styleUrl: './sub-navbar.css'
})
export class SubNavbar {
  constructor(@Inject(DOCUMENT) private doc: Document) {}



  scrollTo(id: string) {
    const el = this.doc.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`); // update URL hash (optional)
  }
}
