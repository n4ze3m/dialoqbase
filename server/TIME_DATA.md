# Live Time and Date Script

This script displays the current date and time in real-time using TypeScript.

## Features

- Updates every second
- Displays both date and time
- Uses `setInterval` for continuous updates

## Usage

Run the script in a Node.js environment:

```sh
node script.ts
```

## Code

```typescript
function getLiveTimeAndDate(): void {
  setInterval(() => {
    let now: Date = new Date();
    let currentTime: string = now.toLocaleTimeString();
    let currentDate: string = now.toLocaleDateString();
    process.stdout.write(
      `Current Date: ${currentDate} | Current Time: ${currentTime}\r`
    );
  }, 1000);
}

getLiveTimeAndDate();
```

## License

This script is open-source and free to use.
