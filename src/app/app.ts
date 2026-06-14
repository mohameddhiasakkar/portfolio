import { Component, signal, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('mon-app');
  protected isDarkMode = signal(false);
  private el = inject(ElementRef);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'dark') {
        this.isDarkMode.set(true);
        document.body.classList.add('dark-mode');
      }
    }
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  private initAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stat-number')) {
            this.animateCounter(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.3 });

    const targets = this.el.nativeElement.querySelectorAll(
      '.project-card, .skill-category, .experience-item, .cert-card, .language-card, .stat-card, .stat-number'
    );
    targets.forEach((el: HTMLElement) => observer.observe(el));
  }

  private animateCounter(el: HTMLElement) {
    const target = parseInt(el.getAttribute('data-target') || '0');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + (target === 100 ? '%' : '+');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
      }
    }, 16);
  }

  protected toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    const darkMode = this.isDarkMode();
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark-mode', darkMode);
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }
}
