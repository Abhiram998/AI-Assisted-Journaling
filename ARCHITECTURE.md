How would you scale to 100k users?
- Use a load balancer (Nginx or cloud load balancer)
- Deploy backend as multiple FastAPI instances
- Use PostgreSQL instead of SQLite
- Use Redis for caching AI analysis results
- Run AI inference asynchronously with message queues

How to reduce LLM cost
- Cache repeated analysis results
- Use smaller HuggingFace models
- Batch requests
- Use async processing

Caching repeated analysis
- Hash journal text
- Store results in Redis cache
- If same input appears, return cached response

Protect sensitive journal data
- HTTPS encryption
- JWT authentication
- Database encryption
- Access control
