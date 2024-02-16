/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: "app.requestly.io" }],
	},
};

module.exports = nextConfig;
