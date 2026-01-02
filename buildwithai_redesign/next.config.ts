import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /.mdx?$/ });

const nextConfig: NextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
});

export default nextConfig;
