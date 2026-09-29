path = "project-explorer.html"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
for line in lines:
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    if stripped == "position: fixed;" and out and out[-1].strip() == ".modal {":
        out.append(indent + "position: absolute;\n")
        continue
    if stripped == "align-items: center;":
        out.append(indent + "align-items: flex-start;\n")
        continue
    out.append(line)

content = "".join(out)
warnings = []

def safe_replace(old, new, label):
    global content
    if old not in content:
        warnings.append(label)
        return
    content = content.replace(old, new, 1)

safe_replace(
    "card.addEventListener('click', () => openModal(project));",
    "card.addEventListener('click', (event) => openModal(project, event.currentTarget));",
    "card click handler"
)

safe_replace(
    "function openModal(project) {\n        modal.hidden = false;",
    "function openModal(project, triggerEl) {\n        modal.hidden = false;",
    "openModal signature"
)

old_end = """          ${renderModalTags(project.tags)}
          ${renderLinks(project.links)}
        `;
      }"""
new_end = """          ${renderModalTags(project.tags)}
          ${renderLinks(project.links)}
        `;

        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        modal.style.height = docHeight + 'px';
        const card = modal.querySelector('.modal-card');
        card.style.marginTop = '0px';
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        let anchorMid = scrollY + (window.innerHeight / 2);
        if (triggerEl) {
          const rect = triggerEl.getBoundingClientRect();
          anchorMid = rect.top + scrollY + (rect.height / 2);
        }
        const cardHeight = card.offsetHeight;
        let top = anchorMid - (cardHeight / 2) - 16;
        top = Math.max(0, Math.min(top, docHeight - cardHeight - 32));
        card.style.marginTop = top + 'px';
      }

      function closeModal() {
        modal.hidden = true;
        modal.style.height = '';
        const card = modal.querySelector('.modal-card');
        if (card) card.style.marginTop = '';
      }"""
safe_replace(old_end, new_end, "openModal end / closeModal insert")

safe_replace(
    "modal.addEventListener('click', (event) => {\n        if (event.target === modal) {\n          modal.hidden = true;\n        }\n      });",
    "modal.addEventListener('click', (event) => {\n        if (event.target === modal) {\n          closeModal();\n        }\n      });",
    "backdrop click close"
)

safe_replace(
    "document.querySelector('.modal-close').addEventListener('click', () => {\n        modal.hidden = true;\n      });",
    "document.querySelector('.modal-close').addEventListener('click', () => {\n        closeModal();\n      });",
    "close button"
)

safe_replace(
    "document.addEventListener('keydown', (event) => {\n        if (event.key === 'Escape') {\n          modal.hidden = true;\n        }\n      });",
    "document.addEventListener('keydown', (event) => {\n        if (event.key === 'Escape') {\n          closeModal();\n        }\n      });",
    "escape key close"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

if warnings:
    print("WARNING - these parts did NOT match and were skipped:")
    for w in warnings:
        print(" -", w)
else:
    print("All patches applied successfully!")