PORT ?= 3000

.PHONY: help nextjs start check test

help:
	@echo "HAAG Project Explorer - Developer Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make nextjs   Start the Next.js dev server at http://localhost:$(PORT)"
	@echo "  make start    Build the static site and serve out/ at http://localhost:$(PORT)"
	@echo "  make check    Run the project, content, and sanitizer checks (npm test)"
	@echo ""
	@echo "Run 'npm install' once before using these commands."
	@echo ""
	@echo "Options:"
	@echo "  PORT=8000 make nextjs  Specify a custom port (default: 3000)"

nextjs:
	npm run dev -- -p $(PORT)

start:
	npm run build
	@echo "Serving out/ at http://localhost:$(PORT)  (Ctrl+C to stop)"
	python3 -m http.server -d out $(PORT)

check: test

test:
	npm test
