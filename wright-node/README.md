# @writerite/acolyte-node

Worker servicing chat in `@writerite/backend-yoga` as a chatroom bot. Check `kubernetes/core/writerite-acolyte-node.deployment.yaml` for deployment configuration alongside `kubernetes/core/writerite-backend-yoga.deployment.yaml`.

## Stack summary

* Language: Typescript
* Communication:
  * Low-latency: Redis PubSub
  * Sending to API server: GraphQL using Apollo Client
  * Locks for async execution: async-lock
* Deployment:
  * Containerization: Docker
  * Orchestration: Kubernetes
