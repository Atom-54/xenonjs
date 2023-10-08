makeJsonRequestUrl(auth)  {
  return `${this.url}.json${auth ? `?auth=${auth}` : ''}`;
}
async publish(value, auth) {
  const request = this.makeJsonRequestUrl(auth);
  const response = await fetch(request, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(value)
  });
  return response?.status;
}