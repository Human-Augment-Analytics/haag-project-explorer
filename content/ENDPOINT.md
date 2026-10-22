\# Page content endpoint contract



How the public site reads page content from the directory, and what happens when that is not available. This is a proposal for discussion with the directory team. The URL below is an example, not a real address.



\## Request



&#x20;   GET <endpoint>/<page>



`<page>` is the same name used in `content/<page>.json`, for example `faculty-affiliates`, `phd-postdoc` or `data-science-research`.



\- Public, read only, no authentication.

\- The site never talks to the database directly. It only calls this endpoint.

\- Cross-origin requests from the site must be allowed (CORS).



\## Response



`200` with a JSON body that validates against `content/blocks.schema.json`:



&#x20;   {

&#x20;     "page": "faculty-affiliates",

&#x20;     "masthead": { "eyebrow": "...", "title": "...", "sub": "..." },

&#x20;     "main": \[ { "type": "heading", "level": 2, "text": "..." } ],

&#x20;     "sidebar": \[]

&#x20;   }



The body is the same shape as the committed file in `content/`. Plain text fields are escaped by the site. Only fields ending in `\_html` are accepted as HTML, and they go through the site's allow-list sanitiser.



\## Wiring on a page



&#x20;   <script src="content-render-blocks.js"

&#x20;           data-flag="dynamicFacultyContent"

&#x20;           data-src="content/faculty-affiliates.json"

&#x20;           data-endpoint="https://example.invalid/api/pages/faculty-affiliates"></script>



\## Failure behaviour



The page must never break because the endpoint is down.



\- If the request fails, returns a non 200 status, returns invalid JSON, or takes longer than 3.5 seconds, the renderer falls back to the committed `data-src` JSON.

\- If that also fails, a warning is logged to the console and the original HTML stays as it is.

\- If the feature flag is off, nothing is fetched at all.



\## Open questions



\- Final URL and path format.

\- Whether the response should include a version or updated-at field so the site can cache.

\- Whether the endpoint should return the page JSON validated server side against the schema.

