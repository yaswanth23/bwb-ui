const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(userIdentifier, password) {
  const response = await fetch(apiUrl + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIdentifier, password }),
  });

  const data = await response.json();
  return data;
}
