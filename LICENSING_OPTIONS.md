# Open Source Licensing Options

This repository is currently configured for Apache License 2.0 in LICENSE.

Below are three viable options for SysWisdom GuardRails, considering your goal to grow an open community while monetizing hosted API and agent offerings.

## Option 1 (Current): Apache-2.0 (Recommended)
Best for broad SDET/developer adoption and commercial friendliness.

Why this fits:
- Permissive license encourages contribution and enterprise usage.
- Includes explicit patent grant and patent retaliation protection.
- Lets third parties build integrations and plugins with minimal friction.
- Supports an open-core plus paid hosted services model.

Business implications:
- Others can self-host and commercially use the open-source code.
- You still monetize:
  - Managed SysWisdom API
  - Hosted SysWisdom.ai agent services
  - Enterprise support, SLA, integrations, compliance features

Guardrails to keep:
- Keep brand/trademark protection in NOTICE and policy docs.
- Keep hosted service terms separate from repository license.

## Option 2: AGPL-3.0
Best if you want stronger reciprocity for hosted forks.

Why teams choose it:
- Forces public sharing of source changes when software is offered over a network.
- Reduces risk of closed hosted clones.

Tradeoffs:
- Lower enterprise adoption in some organizations due to copyleft concerns.
- Partner ecosystem can be slower to adopt.

Fit for SysWisdom:
- Good defensive option if copy-hosting becomes a major concern.
- Less ideal if your immediate goal is maximum community growth.

## Option 3: Dual Licensing (AGPL-3.0 plus Commercial)
Best if you want both open source credibility and paid licensing leverage.

Model:
- Community edition under AGPL-3.0.
- Commercial license for customers needing closed-source or proprietary redistribution rights.

Benefits:
- Strong protection against unreciprocated hosted forks.
- Clear monetization path for enterprises.

Costs:
- More legal/operational overhead for a solo startup.
- Requires clear contributor license policy and commercial licensing workflow.

---

## Practical Recommendation
Use Apache-2.0 now to maximize adoption by SDETs/developers and reduce friction.
Then monetize through hosted API and agent services, support, and enterprise features.

If competitive hosted forks become a major business risk later, revisit AGPL or dual licensing.
