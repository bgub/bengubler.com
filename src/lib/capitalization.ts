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
];

let capitalizationOptions: Record<string, string> = {};

for (let title of speciallyCapitalizedTitles) {
  let escapedTitle = title.replace(/[\/\\^$*+?.()|[\]{}]/gi, "\\$&");

  escapedTitle = escapedTitle.replace(/[A-Za-z]/g, function (match) {
    return "[" + match.toLowerCase() + match.toUpperCase() + "]";
  });

  capitalizationOptions[escapedTitle] = title;
}

export { capitalizationOptions, speciallyCapitalizedTitles };
