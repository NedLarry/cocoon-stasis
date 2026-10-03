import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Milestone } from '../../shared/milestone';
import { PageHero } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { Tick } from '../../shared/tick';

const INBOX: Record<string, string> = {
  General: 'info@appianway.com',
  Careers: 'careers@appianway.com',
  Press: 'press@appianway.com',
  Vendors: 'vendors@appianway.com',
};

@Component({
  selector: 'aw-contact',
  imports: [ReactiveFormsModule, Milestone, PageHero, RevealDirective, Tick],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly topics = Object.keys(INBOX);
  protected readonly sent = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    topic: ['General', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
  });

  // Add offices here as the firm expands.
  protected readonly offices = [{ city: 'Lagos', tz: 'WAT · UTC+1', role: 'Headquarters · Research · Trading · Engineering' }];

  protected showError(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  /**
   * No backend yet: hand the message to the visitor's mail client, routed to the
   * right inbox. Swap this for an HTTP call when a form endpoint exists.
   */
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, topic, message } = this.form.getRawValue();
    const subject = encodeURIComponent(`[${topic}] Enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
    window.location.href = `mailto:${INBOX[topic]}?subject=${subject}&body=${body}`;
    this.sent.set(true);
  }
}
