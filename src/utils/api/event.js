const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getTermsAndConditions(userId) {
  const response = await fetch(
    apiUrl + "/event/terms-and-conditions/" + userId,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  return data;
}
