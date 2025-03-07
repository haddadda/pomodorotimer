class PomodoroTimer {
    constructor() {
        this.timeLeft = 30 * 60; // 30 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;

        // Timer durations in minutes
        this.durations = {
            pomodoro: 30,
            shortBreak: 5,
            longBreak: 15
        };

        // Add new audio elements
        this.tickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2859/2859-preview.mp3');
        this.tickSound.volume = 0.5;

        this.initializeButtons();
        this.updateDisplay();
    }

    initializeButtons() {
        document.getElementById('start').addEventListener('click', () => this.start());
        document.getElementById('pause').addEventListener('click', () => this.pause());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('pomodoro').addEventListener('click', () => this.setTime('pomodoro'));
        document.getElementById('shortBreak').addEventListener('click', () => this.setTime('shortBreak'));
        document.getElementById('longBreak').addEventListener('click', () => this.setTime('longBreak'));
        document.getElementById('toggleMode').addEventListener('click', () => this.toggleMode());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                // Play tick sound for last 10 seconds
                if (this.timeLeft <= 10 && this.timeLeft > 0) {
                    const volume = document.getElementById('volume').value;
                    this.tickSound.volume = volume;
                    this.tickSound.currentTime = 0; // Reset sound to start
                    this.tickSound.play();
                }
                
                if (this.timeLeft === 0) {
                    this.pause();
                    this.playAlarm();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.durations.pomodoro * 60;
        this.updateDisplay();
    }

    setTime(mode) {
        this.pause();
        this.timeLeft = this.durations[mode] * 60;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = display;
    }

    playAlarm() {
        const audio = document.getElementById('alarmSound');
        const volume = document.getElementById('volume').value;
        audio.volume = volume;
        audio.play();
        alert('Time is up!');
    }

    toggleMode() {
        this.isWorkMode = !this.isWorkMode;
        const toggleBtn = document.getElementById('toggleMode');
        
        if (this.isWorkMode) {
            toggleBtn.textContent = 'Work Mode';
            toggleBtn.classList.remove('rest');
            toggleBtn.classList.add('work');
            this.timeLeft = this.durations.pomodoro * 60;
        } else {
            toggleBtn.textContent = 'Rest Mode';
            toggleBtn.classList.remove('work');
            toggleBtn.classList.add('rest');
            this.timeLeft = this.durations.shortBreak * 60;
        }

        this.pause();
        this.updateDisplay();
    }
}

// Initialize the timer when the page loads
const timer = new PomodoroTimer(); 