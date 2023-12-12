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

export async function addTermsAndConditions(userId, termsAndCondition) {
  const response = await fetch(apiUrl + "/event/terms-and-conditions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      termsAndCondition: termsAndCondition,
    }),
  });

  const data = await response.json();
  return data;
}

export async function scheduleEvent(dataObj) {
  const response = await fetch(apiUrl + "/event/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataObj),
  });

  const data = await response.json();
  return data;
}

export async function getEvents(userId, status) {
  const response = await fetch(
    apiUrl + "/event?userId=" + userId + "&status=" + status,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  return data;
}

export async function getEventsCount(userId) {
  const response = await fetch(apiUrl + "/event/count/" + userId, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return data;
}

export async function getUserEventDetails(userId, eventId) {
  const response = await fetch(
    apiUrl + "/event/user/details/" + userId + "/" + eventId,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  return data;
}
