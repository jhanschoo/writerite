export const sendMessage = (m: string) => {
  if (!process.send) {
    return;
  }
  process.send(m);
};
