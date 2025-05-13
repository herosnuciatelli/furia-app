export async function getFanAuth(userId: string) {
  if (userId.length === 0) return

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-fan-auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ authId: userId }),
    next: {
      tags: ["get-fan-auth"],
      revalidate: 300 // cache por 5 minutos
    }
  });

  return response.json();
}