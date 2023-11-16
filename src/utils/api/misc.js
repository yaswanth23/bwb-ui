const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function contactUs(request) {
  const response = await fetch(apiUrl + "/misc/contact-us", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data;
}

export async function verifyUniqueKey(uniqueKey) {
  const response = await fetch(apiUrl + "/misc/verify-key/" + uniqueKey, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}
