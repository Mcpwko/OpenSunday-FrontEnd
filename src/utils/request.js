export default async function (url, getAccessTokenSilently, loginWithRedirect) {
  try {
    let token = await getAccessTokenSilently();

    let response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    await loginWithRedirect();
  }
}
