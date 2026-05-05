# PR Review Prompt

Review this PR using `code_review.md` and `AGENTS.md`.

Focus on:

- correctness;
- architecture boundaries;
- type safety;
- tests;
- maintainability;
- UX impact;
- AI patch safety if relevant.

Return:

1. blocking issues;
2. non-blocking issues;
3. suggested improvements;
4. tests that should be added;
5. final merge recommendation.

Be strict about:

- domain logic outside `packages/core`;
- unvalidated project state;
- AI patches applied without validation;
- playback code coupled to React render loops;
- adding unrelated scope.
