# ADR-002: Frontend Framework

## Status
[Accepted]

## Context
- What problem are we solving? 
    - The software engineer/engineers must use a frontend framework to create their web application (or use HTML, CSS, JavaScript)
- What constraints exist? (tech, time, scale, team)
    - Time: 2 weeks
    - Scale: No users currently
    - Team: 1 person
- What alternatives were considered (briefly)?
    - Vanilla HTML, CSS, JavaScript
    - React.js
    - Angular
    - Vue
    - Next.js

## Decision
- What did we choose?
    - Next.js + TypeScript + TailwindCSS
- High-level explanation of the approach
    - Next.js is a full-stack framework, and it provides server side rendering + static site generation, which the other choices do not and would require more manual effort to reach the same outcome. Routing is an intuitive file-based approach, state management is built in, and it is a quite performant framework.
- Key design details (keep concise)
    - Server side rendering
    - Static side generation
    - File-based routing
    - Built in state management
    - Search Engine Optimization(SEO) -> b/c of SSR & SSG

## Consequences
- Flexibility: Medium
- Tight coupling with Vercel
- File-System based routing
- Opinionated Rendering Models(Server components, SSR, SSG)

### Pros
- Server side rendering
- Static side generation
- File-based routing
- Built in state management
- Search Engine Optimization(SEO) -> b/c of SSR & SSG

### Cons
- Flexibility: Medium
- Mental model shift because of client and server components
- Lots of additional features like SSR, SSG, ISR
- Long build times for big projects
- RAM hungry for larger projects to serve SSR

### Neutral / Notes
- In the long-term, if there are more configurations that are needed for the web application it may be useful to switch frameworks, but for now with the time provided and complexity of the application Next.js seems like a good choice

## Alternatives Considered
- Vanilla -> too much manual work to create components and manually manipulate DOM elements
- React.js -> no SEO optimizations -> UI library
- Vue -> more often used for dashboards, or admin panels because of the simplicity -> progressive framework, but not quite complete
- Angular -> for enterprise applications, internal tools, but a steep learning curve -> complete framework
<!-- 
## Implementation Notes (optional)
- Key technical details
- Migration plan / rollout steps -->

## References (optional)
- Docs, benchmarks, links, issues
- https://medium.com/@gmlsoftlabs121/next-js-vs-vue-js-vs-angular-vs-react-js-decoding-the-web-development-dilemma-26032f37dcdf