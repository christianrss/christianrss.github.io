# Public engineering disclosure policy

The personal portfolio and its project case studies are public. Architecture can be discussed; sensitive implementation details belong only in private engineering records.

## Allowed public material
- Product scope and business/technical problem.
- Logical architecture: major components, responsibilities and broad data flows.
- Public technology categories, established industry standards, architectural alternatives and their trade-offs.
- High-level quality methodology; a clear distinction between source-level test evidence and results from executed tests.
- General environmental limits without publishing security gaps or operational internals.

## Restricted to private repositories
- Credentials, secrets, environment variable values, authentication configuration or privileged workflows.
- Internal hostnames, addresses, private endpoints, service discovery and deployment topology.
- Internal source paths, unpublished contracts, detailed schemas and sensitive dependency inventories.
- Security design specifics, exploit instructions, unresolved vulnerabilities and raw internal logs.
- Test fixtures, privileged procedures, unreviewed operational measures and customer information.
- Numerical capacity, performance or reliability claims without reviewed and reproducible measurements.

## Editorial gate
1. Review every change to `content/*/projects/*.mds` and public portfolio summaries.
2. Run `npm run check:public`; automated checks detect selected accidental disclosures but do not replace human review.
3. Run the MDS build and verify all language routes.
4. Do not copy internal architecture decision records verbatim into the public site.
5. If a disclosure is discovered, update the public page immediately and assess repository history and caches; changing HEAD does not erase previously published versions.
