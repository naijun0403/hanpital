export function generateRndString() {
    const date = new Date();

    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours() + 1}${date.getMinutes() + 1}${date.getSeconds() + 1}`;
}