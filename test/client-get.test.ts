import { expect, test, vi } from "vitest";
import fetch from "node-fetch";

import { testGetMethod } from "./__testutils__/testAnyGetMethod";
import { testAbortableMethod } from "./__testutils__/testAbortableMethod";
import { createTestClient } from "./__testutils__/createClient";
import { mockPrismicRestAPIV2 } from "./__testutils__/mockPrismicRestAPIV2";

testGetMethod("resolves a query", {
	run: (client) => {
		return client.get();
	},
});

testGetMethod("includes params if provided", {
	run: (client) =>
		client.get({
			accessToken: "custom-accessToken",
			ref: "custom-ref",
			lang: "*",
		}),
	requiredParams: {
		access_token: "custom-accessToken",
		ref: "custom-ref",
		lang: "*",
	},
});

testGetMethod("includes default params if provided", {
	run: (client) => client.get(),
	clientConfig: {
		defaultParams: {
			lang: "*",
		},
	},
	requiredParams: {
		lang: "*",
	},
});

testGetMethod("merges params and default params if provided", {
	run: (client) =>
		client.get({
			accessToken: "overridden-accessToken",
			ref: "overridden-ref",
			lang: "fr-fr",
		}),
	clientConfig: {
		accessToken: "custom-accessToken",
		ref: "custom-ref",
		defaultParams: {
			lang: "*",
		},
	},
	requiredParams: {
		access_token: "overridden-accessToken",
		ref: "overridden-ref",
		lang: "fr-fr",
	},
});

testAbortableMethod("is abortable with an AbortController", {
	run: (client, signal) => client.get({ signal }),
});

test("shares concurrent equivalent network requests", async (ctx) => {
	const fetchSpy = vi.fn(fetch);
	const controller1 = new AbortController();
	const controller2 = new AbortController();

	mockPrismicRestAPIV2({ ctx });

	const client = createTestClient({ clientConfig: { fetch: fetchSpy } });

	await Promise.all([
		// Shared: 1 network request
		client.get(),
		client.get(),

		// Shared: 1 network request
		client.get({ signal: controller1.signal }),
		client.get({ signal: controller1.signal }),

		// Shared: 1 network request
		client.get({ signal: controller2.signal }),
		client.get({ signal: controller2.signal }),
	]);

	// Not shared: 2 network requests
	await client.get();
	await client.get();

	// Total of 6 requests:
	// - 1x /api/v2 (shared across all requests)
	// - 5x /api/v2/documents/search
	expect(fetchSpy.mock.calls.length).toBe(6);
});
