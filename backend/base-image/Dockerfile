FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y \
    bash \
    curl \
    wget \
    git \
    jq \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir -p /app/scripts /app/shared

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

RUN chmod 777 /app/scripts /app/shared

ENTRYPOINT ["/app/entrypoint.sh"]
