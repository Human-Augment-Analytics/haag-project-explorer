PORT ?= 8000

.PHONY: help start serve open check test

help:
	@echo "HAAG Project Explorer - Developer Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make start        Start local dev server at http://localhost:$(PORT)"
	@echo "  make open         Start server and automatically open Project Explorer in browser"
	@echo "  make check        Validate project files, manifest, and script syntax"
	@echo ""
	@echo "Options:"
	@echo "  PORT=3000 make start   Specify custom port (default: 8000)"

start: serve

serve:
	@echo "============================================================"
	@echo "  Starting HAAG Project Explorer local server"
	@echo "============================================================"
	@echo "  Project Explorer: http://localhost:$(PORT)/project-explorer.html"
	@echo "  Home Page:        http://localhost:$(PORT)/index.html"
	@echo "  People:           http://localhost:$(PORT)/people.html"
	@echo "  Recruitment:      http://localhost:$(PORT)/recruitment.html"
	@echo "============================================================"
	@echo "  Press Ctrl+C to stop."
	@echo "============================================================"
	@if command -v python3 >/dev/null 2>&1; then \
		python3 -m http.server $(PORT); \
	elif command -v npx >/dev/null 2>&1; then \
		npx -y serve -p $(PORT) .; \
	else \
		echo "Error: python3 or npx is required to serve files locally." && exit 1; \
	fi

open:
	@if [ "$$(uname)" = "Darwin" ]; then \
		(sleep 1 && open "http://localhost:$(PORT)/project-explorer.html") & \
	elif command -v xdg-open >/dev/null 2>&1; then \
		(sleep 1 && xdg-open "http://localhost:$(PORT)/project-explorer.html") & \
	fi
	@$(MAKE) serve

check: test

test:
	@node scripts/validate.js
	@node scripts/test-feature-flags.js
	@node --check embed-resize.js && echo "✅ JavaScript syntax OK"
