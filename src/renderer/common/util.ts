function toUpperFirstLetter(text: string) {
  if (!text) {
    return text;
  }
  return text[0].toUpperCase() + text.slice(1);
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const appUtils = {
  toUpperFirstLetter,
  sleep,
};
