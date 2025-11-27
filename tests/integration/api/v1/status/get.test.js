import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test('Get to /api/v1/status shoud ruturn 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  expect(responseBody.dependencies.database.version).toEqual('16.10');
  expect(Number(responseBody.dependencies.database.max_connection)).toEqual(
    100,
  );

  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
