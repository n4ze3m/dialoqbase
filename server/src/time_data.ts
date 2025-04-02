function getLiveTimeAndDate(): void {
    setInterval(() => {
        let now: Date = new Date();
        let currentTime: string = now.toLocaleTimeString();
        let currentDate: string = now.toLocaleDateString();
        process.stdout.write(`Current Date: ${currentDate} | Current Time: ${currentTime}\r`);
    }, 1000);
}

getLiveTimeAndDate();
