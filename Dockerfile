FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /workspace

ENTRYPOINT ["sh", "-c", "npm ci && npx playwright test \"$@\"", "--"]
CMD []
