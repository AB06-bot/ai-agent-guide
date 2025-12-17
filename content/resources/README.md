# Article Resources Guide

This document explains how to add resources (deals, credits, tools, docs) to articles.

## Frontmatter Format

Add a `resources` array to your article frontmatter:

```yaml
---
title: "Your Article Title"
category: "Infrastructure"
# ... other frontmatter fields ...

resources:
  - name: "AWS Activate Credits"
    url: "https://aws.amazon.com/activate/"
    kind: "credit"
    isAffiliate: true
    note: "Up to $100k credits for eligible startups"
  
  - name: "Azure for Startups"
    url: "https://azure.microsoft.com/free/startups/"
    kind: "credit"
    isAffiliate: false
    note: "Free tier + credits for founders"
  
  - name: "LangChain Documentation"
    url: "https://docs.langchain.com/"
    kind: "docs"
    isAffiliate: false
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Display name for the resource link |
| `url` | string | ✅ Yes | Full URL to the resource |
| `kind` | string | No | One of: `"deal"`, `"credit"`, `"tool"`, `"docs"` |
| `isAffiliate` | boolean | No | Set to `true` if this is an affiliate link |
| `note` | string | No | Optional context shown after the link (e.g., "Up to $100k credits") |

## Resource Kinds

- **`deal`** - Limited-time offers or promotions
- **`credit`** - Cloud credits, startup programs, free tiers
- **`tool`** - Software tools, APIs, platforms
- **`docs`** - Documentation, guides, tutorials

## Display Rules

### Article Pages
Resources appear at the bottom of the article body for these categories:
- Infrastructure
- Agents
- Industries

Resources are **NOT** shown for Policy or Safety articles.

### Homepage
Resources appear on homepage cards only if:
- Article category is "Industries", OR
- Resources include `kind: "deal"` or `kind: "credit"`

Maximum 2 resources shown on homepage (prioritizes deals/credits).

## Affiliate Compliance

When `isAffiliate: true`:
- Link gets `rel="noopener noreferrer nofollow sponsored"`
- Disclosure text appears: "Disclosure: Some links may be affiliate links..."

When `isAffiliate: false` or omitted:
- Link gets `rel="noopener noreferrer"`
- No disclosure shown (unless other resources in the same article are affiliate)

## Example: Full Article with Resources

```yaml
---
title: "Cloud Provider Comparison for AI Agents"
category: "Infrastructure"
source: "TechCrunch"
sourceUrl: "https://techcrunch.com/example"
publishedAt: "2025-01-15T10:00:00Z"
status: "published"

resources:
  - name: "AWS Activate"
    url: "https://aws.amazon.com/activate/"
    kind: "credit"
    isAffiliate: true
    note: "Up to $100k in credits"
  
  - name: "Google Cloud for Startups"
    url: "https://cloud.google.com/startup"
    kind: "credit"
    isAffiliate: true
    note: "Up to $200k in credits"
  
  - name: "AWS Bedrock Docs"
    url: "https://docs.aws.amazon.com/bedrock/"
    kind: "docs"
    isAffiliate: false
---
```

## Notes

- Resources are optional - articles work fine without them
- All fields except `name` and `url` are optional
- YAML parsing handles missing fields gracefully
- Keep resources relevant to the article content
- Avoid adding resources to Policy/Safety articles (they won't display)

