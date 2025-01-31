import { testGetMethod } from "./__testutils__/testAnyGetMethod";
import { testAbortableMethod } from "./__testutils__/testAbortableMethod";

testGetMethod("queries for documents by some tags", {
	run: (client) => client.getBySomeTags(["foo", "bar"]),
	requiredParams: {
		q: `[[any(document.tags, ["foo", "bar"])]]`,
	},
});

testGetMethod("includes params if provided", {
	run: (client) =>
		client.getBySomeTags(["foo", "bar"], {
			accessToken: "custom-accessToken",
			ref: "custom-ref",
			lang: "*",
		}),
	requiredParams: {
		access_token: "custom-accessToken",
		ref: "custom-ref",
		lang: "*",
		q: `[[any(document.tags, ["foo", "bar"])]]`,
	},
});

testAbortableMethod("is abortable with an AbortController", {
	run: (client, signal) => client.getBySomeTags(["foo", "bar"], { signal }),
});
