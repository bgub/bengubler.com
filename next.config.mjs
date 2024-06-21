import { withContentCollections } from "@content-collections/next";

const redirects = {
  // projects
  "/portfolio": "/projects",
  // case cards
  "/czech-case-cards": "/language-learning/czech-case-cards",
  "/russian-case-cards": "/language-learning/russian-case-cards",
  // posts
  "/enroot-on-slurm-for-distributed-ml-part-1":
    "/2023-09-08-enroot-on-slurm-for-distributed-ml-part-1",
  "/my-new-website": "/2023-05-06-my-new-website",
  "/quick-helpful-slurm-commands": "/2023-09-08-quick-helpful-slurm-commands",
  "/multi-gpu-inference-with-accelerate":
    "/2023-06-12-multi-gpu-inference-with-accelerate",
  "/ultimate-ml-dockerfile": "/2023-09-08-ultimate-ml-dockerfile",
  "/introducing-eta-v3": "/2023-06-22-introducing-eta-v3",
  "/enroot-on-slurm-for-distributed-ml-part-2":
    "/2023-09-11-enroot-on-slurm-for-distributed-ml-part-2",
  "/global-config-js": "/2023-06-29-global-config-js",
  "/gom-gpu-monitor-nvidia-smi-replacement":
    "/2023-10-16-gom-gpu-monitor-nvidia-smi-replacement",
  "/llms-limitation-recursion": "/2023-08-23-llms-limitation-recursion",
  "/rebuilding-alpaca-huggingface-trainer":
    "/2023-11-07-rebuilding-alpaca-huggingface-trainer",
  "/accelerate-deepspeed-fsdp": "/2023-08-29-accelerate-deepspeed-fsdp",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return Object.entries(redirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default withContentCollections(nextConfig);
