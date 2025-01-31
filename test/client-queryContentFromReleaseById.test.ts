import { it, expect } from "vitest";
import * as prismicM from "@prismicio/mock";

import { mockPrismicRestAPIV2 } from "./__testutils__/mockPrismicRestAPIV2";
import { createTestClient } from "./__testutils__/createClient";
import {
	testGetOutsideTTL,
	testGetWithinTTL,
} from "./__testutils__/testGetTTL";

// Do not use `_mock` within tests. Use the text-specific `ctx.mock` instead.
const _mock = prismicM.createMockFactory({
	seed: "queryContentFromReleaseByID",
});
const ref1 = _mock.api.ref({ isMasterRef: false });
const ref2 = _mock.api.ref({ isMasterRef: false });
ref2.id = ref1.id;

it("uses a releases ref by ID", async (ctx) => {
	const repositoryResponse = ctx.mock.api.repository();
	repositoryResponse.refs = [ref1];
	const queryResponse = prismicM.api.query({ seed: ctx.meta.name });

	mockPrismicRestAPIV2({
		repositoryResponse,
		queryResponse,
		queryRequiredParams: {
			ref: ref1.ref,
		},
		ctx,
	});

	const client = createTestClient();

	client.queryContentFromReleaseByID(ref1.id);

	const res = await client.get();

	expect(res).toStrictEqual(queryResponse);
});

testGetWithinTTL("uses the cached release ref within the ref's TTL", {
	getContext: {
		repositoryResponse: { refs: [ref1] },
		getRef: () => ref1.ref,
	},
	beforeFirstGet: (args) => args.client.queryContentFromReleaseByID(ref1.id),
});

testGetOutsideTTL("uses a fresh release ref outside of the cached ref's TTL", {
	getContext1: {
		repositoryResponse: { refs: [ref1] },
		getRef: () => ref1.ref,
	},
	getContext2: {
		repositoryResponse: { refs: [ref2] },
		getRef: () => ref2.ref,
	},
	beforeFirstGet: (args) => args.client.queryContentFromReleaseByID(ref1.id),
});
