<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Code Quality Is Enforced
	- [PRINCIPLE_2_NAME] -> II. Testing Evidence Is Mandatory
	- [PRINCIPLE_3_NAME] -> III. UX Consistency Is a Product Requirement
	- [PRINCIPLE_4_NAME] -> IV. Performance Budgets Are Non-Negotiable
	- [PRINCIPLE_5_NAME] -> V. Simplicity and Maintainability Win
- Added sections:
	- Operational Quality Gates
	- Delivery Workflow and Review Policy
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ✅ reviewed (no change required): .github/prompts/speckit.constitution.prompt.md
	- ✅ reviewed (no change required): .github/prompts/speckit.plan.prompt.md
	- ✅ reviewed (no change required): .github/prompts/speckit.specify.prompt.md
	- ✅ reviewed (no change required): .github/prompts/speckit.tasks.prompt.md
	- ⚠ pending (path not present): .specify/templates/commands/*.md
	- ⚠ pending (path not present): README.md
	- ⚠ pending (path not present): docs/quickstart.md
- Follow-up TODOs:
	- None
-->

# Weddingfourcut Constitution

## Core Principles

### I. Code Quality Is Enforced
All production changes MUST pass static analysis, formatting, and peer review before merge.
Every pull request MUST keep code understandable, cohesive, and free from dead paths.
Reviewers MUST reject changes with unexplained complexity or unclear naming.
Rationale: quality gates reduce long-term defects and maintenance cost.

### II. Testing Evidence Is Mandatory
Every behavioral change MUST include tests at the right level (unit, integration, or end-to-end)
and MUST provide failing-to-passing evidence in CI.
Bug fixes MUST include regression tests that fail on the pre-fix behavior.
Merges are blocked when required tests are missing or unstable.
Rationale: verified behavior is more reliable than intent.

### III. UX Consistency Is a Product Requirement
User-facing flows MUST follow consistent interaction patterns, terminology, visual semantics,
and accessibility expectations across screens and states.
Changes to shared UX patterns MUST be reflected in the same pull request scope or explicitly
deferred with approval.
Rationale: consistent experiences improve trust, completion rates, and supportability.

### IV. Performance Budgets Are Non-Negotiable
Features MUST define measurable performance budgets before implementation and MUST prove
compliance before release.
At minimum, each feature MUST state latency, memory or payload constraints, and behavior
under expected concurrency.
If a budget is exceeded, release is blocked unless a documented exception is approved.
Rationale: performance is a core user requirement, not a post-release optimization.

### V. Simplicity and Maintainability Win
Designs MUST prefer the smallest solution that satisfies current requirements.
Teams MUST avoid speculative abstractions and MUST document any non-obvious architectural
decision with trade-offs.
Rationale: simpler systems are easier to change, debug, and scale.

## Operational Quality Gates

- Definition of Done MUST include: lint/format pass, required tests pass, UX acceptance check,
	and performance budget verification for affected features.
- Feature specifications MUST include measurable success criteria and explicit non-functional
	constraints.
- Plans and tasks MUST map directly to constitution principles so compliance can be audited.

## Delivery Workflow and Review Policy

- Work MUST progress as: specification -> plan -> tasks -> implementation -> validation.
- Each pull request MUST include: change summary, test evidence, risk notes, and rollback
	considerations where applicable.
- Reviews MUST confirm principle compliance explicitly. Approval without compliance review is
	invalid.
- Exceptions MUST be documented with owner, expiration date, and mitigation plan.

## Governance

This constitution is the highest-priority engineering policy for this repository.
When lower-level guidance conflicts, this document takes precedence.

Amendment process:
1. Propose changes through a documented pull request referencing impacted principles.
2. Obtain approval from repository maintainers.
3. Update dependent templates and guidance files in the same change set.
4. Record version bump rationale in the change history.

Versioning policy:
- MAJOR: removes or redefines a principle in a backward-incompatible way.
- MINOR: adds a new principle or materially expands required practices.
- PATCH: clarifies wording without changing governance intent.

Compliance review expectations:
- Every plan, spec, and task artifact MUST include an explicit constitution alignment check.
- Reviewers MUST block merges for unresolved constitution violations.
- Exceptions MUST be time-bound and tracked until closed.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
