import { defineBuildConfig } from "unbuild";

// TODO: Support React Native
export default defineBuildConfig({
	failOnWarn: false,
	declaration: true,
	hooks: {
		"rollup:options": (_ctx, options) => {
			const outputOptions = Array.isArray(options.output)
				? options.output
				: [options.output];

			options.output = outputOptions.map((options) => {
				return {
					...options,
					preserveModules: true,
					preserveModulesRoot: "src",
					sourcemap: true,
				};
			});
		},
	},
});
