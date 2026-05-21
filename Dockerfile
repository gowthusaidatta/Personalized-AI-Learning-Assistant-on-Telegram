FROM node:18-slim

# Install OpenClaw globally
RUN npm i -g openclaw@latest --no-progress --no-audit

# Create application directory used as OpenClaw home
ENV OPENCLAW_HOME=/root/.openclaw
RUN mkdir -p ${OPENCLAW_HOME}/skills ${OPENCLAW_HOME}/config
WORKDIR /app

# Copy local config and skills into the container
COPY config/openclaw.json ${OPENCLAW_HOME}/openclaw.json
COPY skills ${OPENCLAW_HOME}/skills

# Expose nothing specific; OpenClaw connects out to Telegram and Ollama
ENV PATH="/usr/local/bin:$PATH"

CMD ["openclaw", "gateway", "start"]
