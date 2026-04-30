function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, String(v));
  }
  for (const child of children) node.append(child);
  return node;
}

function safeLink(url) {
  return typeof url === "string" && url.trim().length > 0 ? url.trim() : null;
}

function formatPartLabel(partId) {
  if (partId === "break") return "Break";
  return `Part ${partId}`;
}

function renderPills(site) {
  const meta = document.getElementById("heroMeta");
  const items = [
    { label: site.location.city, tbd: false },
    { label: site.date.display, tbd: false },
    { label: site.location.venue === "TBD" ? "Venue: TBD" : site.location.venue, tbd: site.location.venue === "TBD" },
    { label: site.location.room === "TBD" ? "Room: TBD" : site.location.room, tbd: site.location.room === "TBD" }
  ];

  meta.replaceChildren(
    ...items.map((item) =>
      el("li", { class: `pill${item.tbd ? " tbd" : ""}` }, [
        el("span", { class: "dot", "aria-hidden": "true" }),
        el("span", { text: item.label })
      ])
    )
  );
}

function renderQuickLinks(materials) {
  const quickLinks = document.getElementById("quickLinks");
  const items = [
    { title: "Slides", url: safeLink(materials.slidesUrl) },
    { title: "Video", url: safeLink(materials.videoUrl) },
    { title: "Code repo", url: safeLink(materials.codeRepoUrl) },
    { title: "Colab", url: safeLink(materials.colabUrl) }
  ];

  quickLinks.replaceChildren(
    ...items.map((it) => {
      const tbd = !it.url;
      const right = tbd ? "TBD" : "Open";
      const attrs = it.url ? { href: it.url, target: "_blank", rel: "noreferrer" } : { href: "#materials" };
      return el(
        "a",
        { class: `quick-link${tbd ? " tbd" : ""}`, ...attrs },
        [el("strong", { text: it.title }), el("span", { text: right })]
      );
    })
  );

  const heroCtas = document.getElementById("heroCtas");
  if (safeLink(materials.slidesUrl)) {
    heroCtas.append(el("a", { class: "button", href: materials.slidesUrl, target: "_blank", rel: "noreferrer" }, ["Slides"]));
  }
  if (safeLink(materials.videoUrl)) {
    heroCtas.append(el("a", { class: "button", href: materials.videoUrl, target: "_blank", rel: "noreferrer" }, ["Video"]));
  }
}

function renderAbout(about, site) {
  const aboutInfo = document.getElementById("aboutInfo");
  const venueText = site?.location?.venue && site.location.venue !== "TBD" ? site.location.venue : "TBD";
  const roomText = site?.location?.room && site.location.room !== "TBD" ? site.location.room : "TBD";
  const timeText = site?.time?.display ?? "TBD";

  aboutInfo.replaceChildren(
    el("div", { class: "about-row" }, [
      el("span", { class: "about-label", text: "Time" }),
      el("span", { class: "about-value", text: timeText })
    ]),
    el("div", { class: "about-row" }, [
      el("span", { class: "about-label", text: "Date" }),
      el("span", { class: "about-value", text: site?.date?.display ?? "TBD" })
    ]),
    el("div", { class: "about-row" }, [
      el("span", { class: "about-label", text: "Location" }),
      el("span", { class: "about-value", text: `${site?.location?.city ?? "TBD"} • ${venueText} • Room ${roomText}` })
    ])
  );

  const body = document.getElementById("aboutBody");
  body.replaceChildren(...about.paragraphs.map((p) => el("p", { text: p })));
}

function renderPresenters(presenters) {
  const grid = document.getElementById("presentersGrid");
  const placeholder = "assets/img/placeholder-avatar.svg";

  grid.replaceChildren(
    ...presenters.map((sp) => {
      const img = el("img", {
        class: "avatar",
        src: sp.image || placeholder,
        alt: `${sp.name} headshot`
      });
      img.addEventListener("error", () => {
        img.setAttribute("src", placeholder);
      });

      const email = sp.email ? `mailto:${sp.email}` : null;
      const website = safeLink(sp.websiteUrl);

      const cardInner = el("div", { class: "box presenter-card presenter-link-card" }, [
        img,
        el("div", {}, [
          el("h3", { class: "presenter-name", text: sp.name }),
          el("p", { class: "presenter-affil", text: sp.affiliation }),
          email
            ? el("a", { class: "presenter-email", href: email }, [el("span", { text: sp.email })])
            : el("span", { class: "presenter-email", text: "Email: TBD" })
        ])
      ]);

      if (!website) return cardInner;
      return el("a", { class: "presenter-link", href: website, target: "_blank", rel: "noreferrer" }, [cardInner]);
    })
  );
}

function renderAudience(audience) {
  const byTitle = new Map(
    (audience.callouts ?? []).map((c) => [String(c.title || "").toLowerCase(), c.bullets ?? []])
  );

  const target = document.getElementById("audienceTarget");
  const prior = document.getElementById("audiencePrior");
  const after = document.getElementById("audienceAfter");

  const targetBullets = byTitle.get("who should attend") ?? [];
  const priorBullets = byTitle.get("prerequisites") ?? [];
  const afterBullets = byTitle.get("what you’ll be able to do after") ?? byTitle.get("what you'll be able to do after") ?? [];

  const renderBanners = (container, bullets, icon) => {
    container.replaceChildren(
      ...bullets.map((text) =>
        el("div", { class: "banner-item", role: "note" }, [
          el("div", { class: `banner-icon ${icon}`, "aria-hidden": "true" }),
          el("div", { class: "banner-text", text })
        ])
      )
    );
  };

  renderBanners(target, targetBullets, "people");
  renderBanners(prior, priorBullets, "check");
  renderBanners(after, afterBullets, "spark");
}

function formatMinuteBadge(durationMin) {
  if (typeof durationMin !== "number" || !Number.isFinite(durationMin)) return "—";
  return `${durationMin}′`;
}

function renderAgenda(agenda, readingListByPart) {
  const grid = document.getElementById("agendaGrid");
  grid.replaceChildren(
    ...agenda.map((item) => {
      const title = `${formatPartLabel(item.partId)}: ${item.title}`;
      const bullets = Array.isArray(item.summaryBullets) ? item.summaryBullets : [];
      const questions = Array.isArray(item.topicsQuestions) ? item.topicsQuestions : [];
      const papers = (item.partId && readingListByPart?.[item.partId]) ? readingListByPart[item.partId] : [];

      const showQuestions = questions.length > 0;
      const showPapers = Array.isArray(papers) && papers.length > 0 && item.partId !== "break";

      const mainParts = [
        el("div", {}, [
          el("h3", { class: "agenda-title", text: title })
        ])
      ];

      if (bullets.length > 0) {
        mainParts.push(el("ul", { class: "agenda-body" }, bullets.map((b) => el("li", { text: b }))));
      }

      if (showQuestions) {
        mainParts.push(
          el("div", {}, [
            el("p", { class: "paper-meta", text: "Topics / questions:" }),
            el("ul", { class: "agenda-body" }, questions.map((q) => el("li", { text: q })))
          ])
        );
      }

      if (showPapers) {
        const paperNodes = papers.map((p) => {
          const metaText = [p.authors, p.venueYear].filter(Boolean).join(" • ");
          const children = [
            el("p", { class: "agenda-paper-title", text: p.title }),
            el("p", { class: "agenda-paper-meta", text: metaText })
          ];
          if (p.note) {
            children.push(
              el("p", { class: "agenda-paper-note" }, [
                el("span", { class: "star", "aria-hidden": "true" }),
                el("span", { text: p.note })
              ])
            );
          }
          return el("div", { class: "agenda-paper" }, children);
        });

        mainParts.push(
          el("div", { class: "agenda-papers" }, [
            el("p", { class: "agenda-papers-title", text: "Representative papers" }),
            ...paperNodes
          ])
        );
      }

      return el("div", { class: "box agenda-card" }, [
        el("div", { class: "minute-badge", text: formatMinuteBadge(item.durationMin) }),
        el("div", { class: "agenda-main" }, mainParts)
      ]);
    })
  );
}

function renderReadingList(agenda, readingListByPart) {
  const grid = document.getElementById("readingGrid");

  const agendaParts = agenda
    .filter((a) => a.partId !== "break")
    .map((a) => ({ partId: a.partId, title: a.title }));

  const cards = [];
  for (const ap of agendaParts) {
    const papers = readingListByPart?.[ap.partId] ?? [];
    if (!papers.length) continue;

    cards.push(
      el("div", { class: "box reading-part-card" }, [
        el("h3", { class: "reading-part-title", text: `${formatPartLabel(ap.partId)} — ${ap.title}` }),
        el(
          "div",
          { class: "paper-scroll", "aria-label": `${formatPartLabel(ap.partId)} reading list` },
          papers.map((p) => {
            const metaText = [p.authors, p.venueYear].filter(Boolean).join(" • ");
            const children = [
              el("p", { class: "paper-title", text: p.title }),
              el("p", { class: "paper-meta", text: metaText })
            ];
            if (p.note) {
              children.push(
                el("p", { class: "paper-note" }, [
                  el("span", { class: "star", "aria-hidden": "true" }),
                  el("span", { text: p.note })
                ])
              );
            }
            return el("div", { class: "paper" }, children);
          })
        )
      ])
    );
  }

  grid.replaceChildren(...cards);
}

function renderMaterials(materials) {
  const grid = document.getElementById("materialsGrid");

  const items = [
    {
      title: "Slides",
      desc: "Tutorial slide deck (PDF).",
      url: safeLink(materials.slidesUrl)
    },
    {
      title: "Video",
      desc: "Recording link once released.",
      url: safeLink(materials.videoUrl)
    },
    {
      title: "GitHub repository",
      desc: "Reference code and benchmark datasets.",
      url: safeLink(materials.codeRepoUrl)
    },
    {
      title: "Colab notebooks",
      desc: "Hands-on, runnable demos (no extra compute required).",
      url: safeLink(materials.colabUrl)
    }
  ];

  grid.replaceChildren(
    ...items.map((it) =>
      el("div", { class: "box material-card" }, [
        el("h3", { text: it.title }),
        el("p", { text: it.desc }),
        it.url
          ? el("a", { href: it.url, target: "_blank", rel: "noreferrer" }, ["Open link"])
          : el("span", { class: "tbd", text: "TBD" })
      ])
    )
  );
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

async function main() {
  initNav();
  document.getElementById("year").textContent = String(new Date().getFullYear());

  const res = await fetch("data/tutorial.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load tutorial data: ${res.status}`);
  const data = await res.json();

  document.getElementById("siteTitle").textContent = data.site.title;
  document.getElementById("eventLine").textContent = data.site.eventLine;

  renderPills(data.site);
  renderQuickLinks(data.site.materials);
  renderAbout(data.about, data.site);
  renderPresenters(data.presenters);
  renderAudience(data.audience);
  renderAgenda(data.agenda, data.readingListByPart);
  renderReadingList(data.agenda, data.readingListByPart);
  renderMaterials(data.site.materials);
}

main().catch((err) => {
  console.error(err);
  const eventLine = document.getElementById("eventLine");
  if (eventLine) eventLine.textContent = "Error loading site data. Check console.";
});

