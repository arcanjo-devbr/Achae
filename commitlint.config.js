
module.exports = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "refactor",
        "style",
        "docs",
        "test",
        "perf",
        "ci",
        "build",
        "revert",
        "cleanup",
        "remove",
      ],
    ],
    "subject-empty": [2, "never"],
  },
};