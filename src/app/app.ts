import { Component, signal, OnInit, AfterViewInit, ElementRef, inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App implements OnInit, AfterViewInit {

  protected readonly title = signal('mon-app');
  protected isDarkMode = signal(false);

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'dark') {
        this.isDarkMode.set(true);
        this.applyTheme(true);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
      this.initSmoothScroll();
      this.initNavScroll();
    }
  }

  private initSmoothScroll() {
    this.el.nativeElement.querySelectorAll('a[href^="#"]').forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') {
          return;
        }

        const target = document.querySelector(href);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  private initNavScroll() {
    const nav = this.el.nativeElement.querySelector('nav');
    if (!nav) {
      return;
    }

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
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

    targets.forEach((el: HTMLElement) => {
      observer.observe(el);
    });
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
    this.isDarkMode.update(value => !value);
    this.applyTheme(this.isDarkMode());
  }

  private applyTheme(darkMode: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.documentElement.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }

  downloadCV(event?: Event) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    event?.preventDefault();

    const link = document.createElement('a');
    link.href = '/assets/cv/cv.pdf';
    link.download = 'Mohamed_Dhia_Sakkar_CV.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
