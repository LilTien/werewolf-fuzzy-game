export const randomDelay = () => Math.floor(Math.random() * 1000) + 100;

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));