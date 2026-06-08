export const sampleRandom = (arr, n) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, n);
