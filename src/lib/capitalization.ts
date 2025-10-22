const speciallyCapitalizedTitles = [
  "EJS",
  "TensorFlow.js",
  "GPU",
  "LLMs",
  "FSDP",
  "vs",
  "DeepSpeed",
  "HPC",
  "ML",
  "gom",
  "nvidia-smi",
  "TL;DR",
  "LLM",
  "AI",
];

const capitalizationOptions: Record<string, string> = {};

for (const title of speciallyCapitalizedTitles) {
  let escapedTitle = title.replace(/[/\\^$*+?.()|[\]{}]/gi, "\\$&");

  escapedTitle = escapedTitle.replace(
    /[A-Za-z]/g,
    (match) => `[${match.toLowerCase()}${match.toUpperCase()}]`,
  );

  capitalizationOptions[escapedTitle] = title;
}

export { capitalizationOptions, speciallyCapitalizedTitles };
