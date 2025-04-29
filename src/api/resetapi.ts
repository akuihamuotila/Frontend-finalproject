export const resetDatabase = async (): Promise<void> => {
  const response = await fetch(
    "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Tietokannan resetointi epäonnistui");
  }
};
