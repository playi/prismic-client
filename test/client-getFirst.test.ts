import { it, expect } from "vitest";

import * as prismicM from "@prismicio/mock";

import { testGetFirstMethod } from "./__testutils__/testAnyGetMethod";
import { testAbortableMethod } from "./__testutils__/testAbortableMethod";
import { mockPrismicRestAPIV2 } from "./__testutils__/mockPrismicRestAPIV2";
import { createTestClient } from "./__testutils__/createClient";

import * as prismic from "../src";

testGetFirstMethod("returns the first document from a response", {
	run: (client) => client.getFirst(),
});

testGetFirstMethod("includes params if provided", {
	run: (client) =>
		client.getFirst({
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

testGetFirstMethod("includes default params if provided", {
	run: (client) => client.getFirst(),
	clientConfig: {
		defaultParams: {
			lang: "*",
		},
	},
	requiredParams: {
		lang: "*",
	},
});

testGetFirstMethod("merges params and default params if provided", {
	run: (client) =>
		client.getFirst({
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

testGetFirstMethod(
	"ignores default pageSize=1 param if a page param is given",
	{
		run: (client) =>
			client.getFirst({
				pageSize: 2,
			}),
		requiredParams: {
			pageSize: "2",
		},
	},
);

it("throws if no documents were returned", async (ctx) => {
	mockPrismicRestAPIV2({
		queryResponse: prismicM.api.query({
			seed: ctx.meta.name,
			documents: [],
		}),
		ctx,
	});

	const client = createTestClient();

	await expect(() => client.getFirst()).rejects.toThrowError(
		/no documents were returned/i,
	);
	await expect(() => client.getFirst()).rejects.toThrowError(
		prismic.PrismicError,
	);
});

testAbortableMethod("is abortable with an AbortController", {
	run: (client, signal) => client.getFirst({ signal }),
});
