# ADR-001: Authentication Method

## Status
[Accepted]

## Context
- What problem are we solving?
    - Users must access data related to their account, but they must be authenticated to do so
- What constraints exist? (tech, time, scale, team)
    - Time: 2 weeks
    - Scale: No users currently
    - Team: 1 person
- What alternatives were considered (briefly)?
    - Prepackaged
        - Supabase Auth
        - Amazon Cognito
    - Self-crafted
        - Basic (user:password encoded)
        - Cookie
        - Token
        - One Time Password
        - API Key

## Decision
- What did we choose?
    - Supabase Authentication
- High-level explanation of the approach
    - Supabase Authentication is a batteries-included solution with minimal setup, and it provides production level security. In comparison, Amazon Cognito demands a lot of configuration, which under the time, scale, and team constraints does not seem worth the time. Moreover, if any of the self-crafted solutions were attempted, they would lack in comparison to the prepackaged solutions unless a significant amount of time was spent on them.
<!-- - Key design details (keep concise) -->

## Consequences

### Pros
- Saves a lot of time in comparison to Amazon Cognito while still providing high-quality security and a variety of authentication methods(JWT Token, OAuth, OTP/Passwordless Login)
- Supabase Authentication is more secure than the time it would take to create a similar production grade solution from scratch.
- Easy to setup and administer

### Cons
- Not as much flexibility in configuration that enterprises would require -> not important for us
- Amazon Cognito provides granular security through adaptive authentication and complex authentication flows
- Not in the Amazon ecosystem

### Neutral / Notes
- Once there are more users it may be worth migrating to Amazon ecosystem

<!-- ## Alternatives Considered -->

<!-- ## Implementation Notes (optional)
- Key technical details
- Migration plan / rollout steps -->

## References (optional)
- Docs, benchmarks, links, issues
- https://dev.to/sleeplessfox/why-i-switched-from-aws-cognito-to-supabase-the-week-before-my-startup-launched-269c
- https://medium.com/write-a-catalyst/6-authentication-methods-i-wish-i-knew-before-building-my-first-web-app-abb969e96dc6
