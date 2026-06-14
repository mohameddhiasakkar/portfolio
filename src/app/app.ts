import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('mon-app');
  protected isDarkMode = signal(false);

  ngOnInit() {
    // Initialize theme from localStorage on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark-mode');
    }
  }

  protected toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    const darkMode = this.isDarkMode();
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }
}
