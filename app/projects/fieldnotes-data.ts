import type { Project } from "./data";

/** Portfolio copy supplied by the owner, 28 October 2026. */
export const fieldnotes: Project = {
  "id": "fieldnotes",
  "number": "No. 04",
  "tagList": [
    "Product design",
    "Mapping",
    "Web + iPhone"
  ],
  "status": "In development",
  "title": "Fieldnotes",
  "tagline": "A personal field guide to the trees on your everyday walks.",
  "summary": "Explore London’s trees, collect a discovery when you’re nearby, and keep a journal of places, photos and small observations. A working web and iPhone prototype, still growing.",
  "cover": {
    "src": "/fieldnotes-explore.png",
    "alt": "Fieldnotes Explore screen with a charcoal header, a map of London showing green tree-record clusters and an orange collected cluster, and Explore, Collection and Journal navigation.",
    "note": "your usual walk, a new way of seeing"
  },
  "idea": "A tree can be part of your daily route for years without ever becoming familiar. I wanted to turn that passing encounter into a small moment of attention: find its name, look a little closer, and leave a note for next time.",
  "timeline": [
    {
      "label": "Explore — Find a tree on your usual route."
    },
    {
      "label": "Collect — Be there. Look a little closer."
    },
    {
      "label": "Remember — Give the moment somewhere to live."
    }
  ],
  "chapters": [
    {
      "title": "The question",
      "text": [
        "Could a map encourage someone to pay attention to the nature already around them? The core experience became a short loop: explore, visit, collect, remember. The journal gives a walk a memory beyond the map."
      ]
    },
    {
      "title": "Making a city feel local",
      "text": [
        "The inventory brings together over 1.2 million tree records from London’s public datasets and OpenStreetMap. That scale belongs behind the scenes. On screen, the map starts with an area, and the nearby list shows five entries before offering “See all”.",
        "Each mapped record keeps its source. An inventory is a starting point for a walk, rather than a promise that every tree has been checked in person."
      ]
    },
    {
      "title": "What “collected” means",
      "text": [
        "Early versions marked every tree of a saved species as collected. That made the map look as though places had been visited when they hadn’t. I changed the meaning to the exact tree: a collected tree turns orange, while its unvisited neighbours stay green. Repeat visits remain separate encounters in the journal."
      ]
    },
    {
      "title": "Leaving room for not knowing",
      "text": [
        "Some source records have no confirmed species. Those trees still deserve a place in the experience. They can be collected as identification pending, keeping the original clues and optional personal photos without inventing a name."
      ]
    },
    {
      "title": "Building for a walk",
      "text": [
        "The same core interface runs on the web and inside a Capacitor iPhone app. Collection checks that the person is close to the tree. Notes and optional photos belong to private encounters, and a local copy supports continuity between visits.",
        "The iPhone prototype is installed. Outdoor collection and the complete native photo round trip are still part of the next verification work."
      ]
    },
    {
      "title": "Under the surface",
      "text": [
        "JavaScript and Leaflet for the map; Capacitor for the iPhone shell; private account sync, a database for encounters and private file storage for photos. Data checks preserve source IDs and coordinates, while regression checks cover collection identity, map counts and location rules.",
        "1.2 million+ inventory records · 447 identified species keys · source-linked records"
      ]
    },
    {
      "title": "Next, out on a walk",
      "text": [
        "Verify the full collecting and photo journey outdoors on the iPhone, then observe whether someone new can find and save their first tree without help. Those are the next questions, before making claims about wider use.",
        "Outdoor iPhone collection, complete native photo upload and retrieval, and post-update collection retention still require owner verification."
      ]
    }
  ],
  "ledgerTitle": "What changed, and why",
  "ledgerHead": [
    "Starting point",
    "The problem",
    "The change"
  ],
  "changes": [
    {
      "tried": "A species-wide collected colour",
      "happened": "Unvisited neighbours looked collected",
      "became": "Only the exact collected tree changes colour"
    },
    {
      "tried": "Small map targets",
      "happened": "A near-miss tap could do nothing",
      "became": "More forgiving tap areas; keyboard activation"
    },
    {
      "tried": "A long nearby list",
      "happened": "Too much to scan on a phone",
      "became": "Five nearest entries, with “See all”"
    },
    {
      "tried": "Unknown species at a dead end",
      "happened": "Missing names stopped a discovery",
      "became": "Pending discoveries with source clues and photos"
    },
    {
      "tried": "One journal for everything",
      "happened": "Repeat encounters were harder to revisit",
      "became": "A species journal with its own encounter map"
    }
  ],
  "learned": [
    "A map’s colours are promises. They need to mean exactly what the person thinks they mean.",
    "“I don’t know yet” can be a useful and honest product state.",
    "The details of a familiar walk can be enough to build an experience around."
  ],
  "links": []
};
