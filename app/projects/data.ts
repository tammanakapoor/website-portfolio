/** Project archive content, shared by the index grid and each project page. */

export type Figure = { src: string; alt: string; caption: string };
export type Chapter = { title: string; text: string[]; figures?: Figure[] };
export type Quote = { text: string; by: string };
export type Moment = { label: string };
export type Change = { tried: string; happened: string; became: string };
export type ProjectLink = { label: string; href: string; external?: boolean };

export type Project = {
  id: string;
  number: string;
  tagList: string[];
  status: string;
  title: string;
  tagline: string;
  summary: string;
  cover: { src: string; alt: string; note: string };
  idea: string;
  timeline: Moment[];
  chapters: Chapter[];
  ledgerTitle: string;
  ledgerHead: string[];
  changes: Change[];
  learned: string[];
  quote?: Quote;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "daily-cafe",
    number: "No. 01",
    tagList: ["Website", "Illustration", "Sound"],
    status: "Live",
    title: "Daily Café",
    tagline: "A quiet café-style webpage. You arrive, press one button, and music starts with the sound of a coffee shop underneath it.",
    summary: "One button, a hand-drawn room, and ninety-six instrumental tracks ordered so the day rises to midday and softens towards closing. Made for people who miss the noise of a café.",
    cover: { src: "/daily-cafe-cover.jpg", alt: "Hand-drawn Daily Café interior with a barista, a menu board, hanging plants and a guest at a table", note: "drawn frame by frame, mostly at night" },
    idea: "A hobby project, made for people who miss being in a café, and for me. Sometimes you need a bit of noise in the background so that it is not so quiet. You walk in, nobody asks anything of you, and there is music and a low hum of people. Nothing makes a sound until you press the button. After that it looks after itself: tracks crossfade, the ambience never restarts, and when the playlist ends it quietly begins again.",
    timeline: [
      { label: "First version live: one button, one room recording" },
      { label: "Busier room with a door bell, then the bell silenced" },
      { label: "Full licensed playlist, shuffled" },
      { label: "Indian classical and indie join the day" },
      { label: "Hand-drawn café brought into the player" },
      { label: "Renamed for a day, then changed back" },
    ],
    chapters: [
      {
        title: "Why",
        text: [
          "I missed the sound of a café more than the coffee. Working from home is too quiet, and a playlist on its own does not fix that. What I wanted was the room: people, cups, movement, and music that nobody chose for me. The first thing I wrote was a list of everything the page would not have. Accounts, volume sliders, settings, rooms, search, navigation. One button.",
        ],
      },
      {
        title: "How I made it",
        text: [
          "I drew the room first. The barista, the tiled counter, the menu board, the plants on the shelf. That decided the mood before any code, and anything that would not fit in the drawing did not go on the page. The original plan used YouTube and commercial songs. Licensing made that impossible to do properly, so every track is Creative Commons or public domain, self-hosted, and credited on screen while it plays.",
          "The sound is two layers. A small riverside café in Worcestershire is the room. A barista layer, recorded beside an espresso machine in Brazil, fades in twenty-five seconds later. The music is ninety-six tracks from fifty-nine artists, ordered by measured loudness so the day rises to midday and softens towards closing.",
        ],
      },
      {
        title: "What changed after people listened",
        text: [
          "I sat friends down with it and did not explain anything. The first room was too still, so it became a busier café with a door bell. The bell was then the one thing everyone mentioned, so it went. Early on the playlist was mostly one artist and people could tell. Vocal tracks pulled attention, so it is instrumental only now. The artwork was tried on blue, then redrawn on white. I even renamed it once and changed it back the same day.",
        ],
      },
    ],
    ledgerTitle: "Tried, and dropped",
    ledgerHead: ["Tried", "What happened", "What it became"],
    changes: [
      { tried: "YouTube playback and a commercial playlist", happened: "Could not be licensed properly", became: "Self-hosted Creative Commons tracks, credited on screen" },
      { tried: "A quiet room recording", happened: "Felt empty", became: "A busier riverside café, people and cups" },
      { tried: "A door bell in the room", happened: "The only thing anyone mentioned", became: "No bell; the machine fades in after twenty-five seconds" },
      { tried: "Vocal Indian classical, a country set", happened: "Pulled attention from whatever you were doing", became: "Instrumental only" },
    ],
    learned: ["Licensing is a design material, not paperwork.", "Restraint is a feature people can feel.", "Measure before you sort: loudness made a better playlist than taste alone."],
    links: [{ label: "Visit the café", href: "https://daily-cafe-psi.vercel.app", external: true }],
  },
  {
    id: "floraquest",
    number: "No. 02",
    tagList: ["Learning game", "Product design", "UX research"],
    status: "Public beta",
    title: "FloraQuest",
    tagline: "A friendly guessing game that turns plant knowledge into a trail of clues, branches and discoveries.",
    summary: "Three small guessing games and a field journal, built to test whether a guess made before the answer makes the answer stick. 325 reviewed plants, in public beta and still changing.",
    cover: { src: "/floraquest-cover.png", alt: "FloraQuest title with a sunflower, a fern, a bee and a small field notebook", note: "still growing" },
    idea: "In the classroom, a guess made before the answer is what makes the answer stick. FloraQuest is built on that. Three small games—Mystery Plant, Picture Guess and Plant Facts—give you a clue and let you commit to a name. Every plant you find lands in a Field Journal that grows the more you play.",
    timeline: [
      { label: "Private beta as PlantKin, thirty plants" },
      { label: "Public beta with a feedback page" },
      { label: "Renamed FloraQuest; difficulty paths" },
      { label: "Scoring, streaks and achievements" },
      { label: "A wrong guess becomes a lesson; accessibility pass" },
      { label: "Deployed publicly" },
      { label: "Full visual redesign" },
      { label: "325 plants; UK and India seasons" },
    ],
    chapters: [
      {
        title: "The hypothesis",
        text: [
          "A guess made before the answer makes the answer stick. I have watched that work in a classroom for years. The game exists to test whether the habit survives outside one, with no teacher in the room and nobody obliged to keep going.",
        ],
      },
      {
        title: "What I needed to learn first",
        text: [
          "Three questions shaped the first beta. Do people understand the rules without being told? Is a wrong guess motivating or discouraging? Are the photographs recognisable to a beginner, or only to me? Everything else could wait.",
        ],
      },
      {
        title: "How I tested it",
        text: [
          "A small private beta a week after the first build, then a public one. A feedback page sorted every note into four kinds: an idea, a confusing moment, a bug, or praise. I sat with people while they played and noted where they paused, what they tapped, and when they stopped. Alongside that, automated checks ran on every change: a content review of every plant, a session audit, an accessibility audit, and a script that checks the design system against its own rules.",
        ],
      },
      {
        title: "What I saw",
        text: [
          "Confusion clustered in three places. Early hints that gave the answer away, a permanent score strip that pulled eyes from the clue, and a homepage that offered three equal doors to a first-time player. Phone users met sideways scrolling. Keyboard and screen-reader users could not use the plant search at all. End-of-round summaries read like a report card and nobody read them.",
          "The wrong-guess question had a clear answer. A penalty on its own taught nothing. A wrong guess that shows how the two plants differ kept people playing.",
        ],
      },
      {
        title: "What changed because of it",
        text: [
          "Every observation above became a change, and the table below is the record. Phone layouts were rebuilt. The plant search works from the keyboard and announces its results. Attempts, hints and achievements are read aloud as they change, and motion switches off when a device asks for it. A first-time player gets a guided first round.",
          "The larger finding was that the game worked but looked like admin. By September I had painted a new hero illustration, written a design analysis against it, and rebuilt every screen: warm paper, deep green ink, two typefaces, one soft shadow, and a single orange accent that appears once per screen.",
        ],
      },
      {
        title: "What I would measure next",
        text: [
          "Round completion by game, time to first solve for a new player, and whether people come back after a week. The beta records aggregate counts, not retention, so that is the gap. The catalogue is at 325 reviewed plants with seasonal collections for the United Kingdom and India, and the next work is on the clues themselves: shorter, kinder, and more like something a friend would say on a walk.",
        ],
      },
    ],
    ledgerTitle: "Findings, and what changed",
    ledgerHead: ["What I tried", "What I observed", "What I changed"],
    changes: [
      { tried: "End-of-session summaries", happened: "Read like a report card; nobody read them", became: "Removed the same day; scores live in the journal" },
      { tried: "A permanent score strip", happened: "Pulled eyes away from the clue", became: "Score appears only in the journal and on sharing" },
      { tried: "A wrong guess as a penalty", happened: "Taught nothing; people stopped", became: "A wrong guess shows how the two plants differ" },
      { tried: "Three equal games on the homepage", happened: "New players hesitated at the door", became: "A guided first round; Picture Guess suggested first" },
      { tried: "Mouse-only plant search", happened: "Unusable by keyboard and screen reader", became: "Keyboard listbox with live announcements" },
      { tried: "Emoji icons and a dashboard", happened: "Felt like admin, not a walk", became: "Warm paper, one accent, hand-painted hero" },
    ],
    learned: ["Content is the product. Reviewing 325 plants shaped the game more than any feature.", "Rules you can say in one breath are rules people trust.", "A design system needs a way to check itself."],
    links: [{ label: "Play FloraQuest", href: "https://floraquest.tammana4513.workers.dev", external: true }],
  },
  {
    id: "energy-changes",
    number: "No. 03",
    tagList: ["Learning design", "H5P · Lumi", "Chemistry"],
    status: "Tested in class",
    title: "Making Energy Changes Visible",
    tagline: "An interactive secondary chemistry learning experience exploring exothermic and endothermic reactions, energy profiles, activation energy and catalysts.",
    summary: "Three H5P experiences, built in Lumi, that move learners from a thermometer reading to an energy-profile diagram to a catalyst’s pathway. Tested with Year 10 and 11 students, and reshaped by what they found hard.",
    cover: { src: "/energy-changes-cover.svg", alt: "A hand-drawn energy-profile diagram showing two reaction pathways, one with a catalyst and a lower activation energy", note: "the diagram everything leads to" },
    idea: "I designed a three-part interactive learning pathway that moves learners from observable temperature changes to abstract energy-profile diagrams and catalyst pathways, using targeted feedback to address common misconceptions. It is a self-initiated project, planned in Figma and built in H5P with Lumi, with a focus on curriculum sequencing, misconceptions, interaction design and assessment.",
    timeline: [
      { label: "Four misconceptions written down before any screen" },
      { label: "A three-part pathway: observe, model, apply" },
      { label: "Experience 1: thermometers before terminology" },
      { label: "Experience 2: two arrows on one diagram" },
      { label: "Experience 3: catalysts change the pathway" },
      { label: "Feedback woven through, not saved for the end" },
      { label: "Accessibility pass: hierarchy, load, drag alternatives" },
      { label: "Tested with Year 10 and 11; more scaffolding added" },
    ],
    chapters: [
      {
        title: "The learning challenge",
        text: [
          "Energy changes in chemical reactions are difficult because learners must connect observable temperature changes with abstract ideas about energy transfer, reaction profiles and activation energy. These concepts are also prone to misconceptions, especially when learners treat “exothermic” as simply meaning hot, confuse activation energy with energy released, or assume catalysts add energy to a reaction. The four I designed against are in the table further down.",
        ],
      },
      {
        title: "The learning pathway",
        text: [
          "To address these misconceptions, I designed a three-part sequence that moves learners from observable evidence to abstract representation and application. Observe and investigate: learners explore real-world scenarios and simple experiments to observe temperature changes and identify whether reactions release or absorb heat. Model and explain: learners connect observations to energy-profile diagrams to explain activation energy and overall energy change. Apply and extend: learners examine catalysts and compare pathways, applying their understanding to new contexts and prediction tasks.",
        ],
      },
      {
        title: "Experience 1: observe and explain",
        text: [
          "The first experience begins with something learners can observe directly, like temperature change. From there, the activities guide them towards explaining the direction of energy transfer before introducing the terms exothermic and endothermic.",
          "I began with measured temperature change rather than scientific terminology, giving learners a concrete observation to reason from. The terms were introduced only after learners had identified the direction of energy transfer. Later activities ask learners to classify reactions independently, using temperature evidence without step-by-step prompts.",
        ],
        figures: [
          { src: "/energy-changes/exp1-observe.jpg", alt: "Reaction A, observe: two conical flasks with thermometers reading 20°C before and 24°C after a reactant is added, beside the question ‘What happened to the temperature during the reaction?’", caption: "experience 1, slide 2: a thermometer before any terminology" },
          { src: "/energy-changes/exp1-transfer.jpg", alt: "Explain the energy transfer: the temperature rose from 20°C to 24°C. Two labelled arrows offer ‘reacting system to surroundings’ or ‘surroundings to reacting system’, with a question asking which direction energy was transferred", caption: "slide 3: which way did the energy go?" },
        ],
      },
      {
        title: "Experience 2: represent",
        text: [
          "The second experience moves learners from observable temperature change to energy-profile diagrams. Learners interpret reactant and product energy levels, identify activation energy, and distinguish it from the overall energy change.",
          "Diagrams were introduced only after learners had already reasoned about energy transfer from temperature evidence. Activation energy and overall energy change were represented with different arrows so learners could compare where each quantity begins and ends, and see that both exothermic and endothermic reactions require activation energy even though their overall energy changes are different.",
        ],
        figures: [
          { src: "/energy-changes/exp2-reading.jpg", alt: "Reading an energy-profile diagram: two flat lines, reactants drawn higher than products, with the question ‘If one point is higher on the vertical axis than another, what does that tell us?’", caption: "experience 2, slide 2: the first diagram, no curve yet" },
          { src: "/energy-changes/exp2-energy-from.jpg", alt: "Where does the energy come from? An energy profile with products higher than reactants, a question about what this says about energy transfer, and a highlighted chain of reasoning ending in ‘endothermic’", caption: "slide 6: products higher, so where did the energy come from?" },
          { src: "/energy-changes/exp2-arrows.jpg", alt: "Activation energy versus overall energy change: an energy profile with a red arrow for activation energy and a blue arrow for overall energy change, and the question ‘Which statement correctly describes the two arrows?’", caption: "slide 9: two arrows, two different quantities" },
        ],
      },
      {
        title: "Experience 3: apply",
        text: [
          "The final experience helps learners apply their understanding by exploring how catalysts provide an alternative reaction pathway. Learners compare reactions with and without a catalyst and explain why the reactant and product energy levels, and therefore the overall energy change, remain unchanged.",
          "The activities highlight what stays the same, so learners can distinguish between a change in activation energy and a change in overall energy change. Learners are then prompted to evaluate statements such as “catalysts add energy” or “catalysts change the overall energy change”, with targeted feedback explaining why these are incorrect.",
        ],
        figures: [
          { src: "/energy-changes/exp3-pathways.jpg", alt: "Compare two reaction pathways: Pathway A drawn solid with a high peak and Pathway B dashed with a lower peak, both starting and ending at the same levels, with the question ‘What is different between Pathway A and Pathway B?’", caption: "experience 3, slide 2: what is different?" },
          { src: "/energy-changes/exp3-reveal.jpg", alt: "Reveal the activation-energy difference: the same two pathways with a red arrow for the higher activation energy and a grey arrow for the lower one, and the note that both pathways begin and end at the same energy levels", caption: "slide 4: only the height of the barrier changes" },
        ],
      },
      {
        title: "Assessment and feedback",
        text: [
          "Assessment was embedded throughout the learning pathway rather than saved for the end. Questions were used to surface misconceptions, check understanding at each stage, and provide immediate feedback that explained why an answer was correct or incorrect.",
          "Early diagnostic questions reveal how learners interpret temperature change, energy transfer and reaction profiles before new terminology is introduced. Incorrect options are based on common misconceptions, so a wrong answer tells me something. Feedback does more than identify right or wrong: it redirects attention to the relevant scientific idea and helps learners distinguish between closely related concepts. The principle I kept returning to is that every incorrect answer should reveal something about the learner’s thinking and provide a useful next step.",
        ],
        figures: [
          { src: "/energy-changes/feedback-reaction-g.jpg", alt: "Reaction G starts at 21°C and finishes at 15°C. The correct answer, ‘energy was transferred from the surroundings to the reacting system’, is ticked in green with an explanation that this is an endothermic reaction", caption: "a right answer still gets the reasoning" },
          { src: "/energy-changes/feedback-drag.jpg", alt: "Drag each label to the correct part of the diagram: an energy profile with catalysed and uncatalysed pathways, with four empty drop zones and four labels to place: catalysed pathway, uncatalysed pathway, lower activation energy, higher activation energy", caption: "slide 7: labels go on the diagram, not in a list" },
        ],
      },
      {
        title: "Accessibility and inclusive design",
        text: [
          "Accessibility decisions were built into the learning experience from the start, with attention to clarity, cognitive load, visual hierarchy and the use of multiple ways to represent scientific ideas. Each screen focuses on one key idea, with limited on-screen text and consistent placement of diagrams, questions and feedback.",
          "Learners move between temperature data, energy-transfer language and energy-profile diagrams, which supports connections between observable evidence and abstract models. New terminology is introduced only after learners have first reasoned from evidence, and complex ideas are broken into smaller steps. Interactive tasks use clear labels, concise instructions and immediate feedback, and where possible offer a non-drag alternative for learners who find drag-and-drop difficult to use.",
        ],
      },
      {
        title: "Tools and workflow",
        text: [
          "I used a combination of tools to design, develop and refine the learning experience, choosing each for the strengths it offered at a different stage. Figma for planning the learning experience, creating the visual design and prototyping the layout and interactions, because it is flexible and ideal for rapid iteration. H5P, through Lumi, to build the interactive activities, including questions, drag-and-drop tasks and branching feedback, because it is open source, easy to use and widely supported. Images and icons from trusted sources to support clarity and accessibility.",
        ],
      },
      {
        title: "Learner testing",
        text: [
          "I tested selected activities with Year 10 and 11 students in a school setting. Learners needed substantial scaffolding when moving from observable temperature changes to more abstract ideas such as energy profiles and activation energy. A step-by-step introduction of concepts helped them build understanding more successfully.",
          "Learners understood the topic more easily when concepts were introduced in small, sequential steps. Abstract representations such as energy-profile diagrams required more support than observable evidence such as temperature change. Common misconceptions included thinking that catalysts add energy or change the overall energy change.",
          "In response, I increased scaffolding in the early stages of each experience, introduced key terminology only after learners had reasoned from evidence, used repeated visual cues and immediate feedback to reinforce key distinctions, and reduced support gradually as learners moved towards application tasks.",
        ],
      },
      {
        title: "Reflection and next steps",
        text: [
          "This project strengthened my skills in instructional design and deepened my understanding of how learners build scientific concepts. It also highlighted areas for further development.",
          "What worked well: a clear progression from concrete evidence to abstract representation, interactive tasks that engaged learners and surfaced misconceptions, step-by-step scaffolding that supported understanding of the more complex ideas such as activation energy, and a consistent visual design that kept the focus on one key idea at a time.",
          "What I would improve: explore additional ways to represent abstract ideas, such as animations or interactive simulations; refine the feedback for common misconceptions using a wider range of learner responses; and consider adaptive pathways for learners who need additional support.",
          "Next steps: conduct more extensive user testing with a larger and more diverse group of learners, gather data on how the activities affect understanding and retention over time, adapt the approach for other topics in science, and continue developing my skills in inclusive design and accessible interaction design.",
          "Testing with real learners reinforced the value of a scaffolded, evidence-based approach and showed how thoughtful design can make complex scientific ideas more accessible and engaging.",
        ],
      },
    ],
    ledgerTitle: "Misconceptions, and how the pathway answers them",
    ledgerHead: ["Misconception", "What learners do", "How the pathway answers it"],
    changes: [
      { tried: "“Exothermic means hot”", happened: "Focus on temperature rather than the direction of energy transfer", became: "Experience 1 starts with a thermometer reading and asks which way the energy went before naming anything" },
      { tried: "“Activation energy is the energy released”", happened: "Confuse the initial energy barrier with the overall energy change", became: "Two different arrows on one diagram, so learners compare where each quantity begins and ends" },
      { tried: "“Catalysts add extra energy”", happened: "Do not see that a catalyst provides an alternative pathway with a lower activation energy", became: "Pathway A and Pathway B side by side; only the height of the barrier changes" },
      { tried: "“Catalysts change the overall energy change”", happened: "Assume the reactant or product energy levels move", became: "Activities highlight what stays the same, with feedback on why the statement is wrong" },
    ],
    learned: [
      "Build from observable evidence. A thermometer reading comes before an energy model.",
      "Separate closely related concepts. Activation energy and overall energy change get their own arrows.",
      "Use application to challenge misconceptions. Ask what changes with a catalyst, and what stays the same.",
    ],
    quote: {
      text: "The step-by-step explanations really helped. I found it much easier to understand when we looked at the temperature change first before moving to the energy diagram.",
      by: "Year 10 student",
    },
    links: [
      { label: "Try Experience 1: observe and explain", href: "https://app.lumi.education/run/OthXGY", external: true },
      { label: "Try Experience 2: represent", href: "https://app.lumi.education/run/Vdpf3e", external: true },
      { label: "Try Experience 3: apply", href: "https://app.lumi.education/run/CI-v-e", external: true },
      { label: "Read the full case study on Figma", href: "https://www.figma.com/design/MqVTNTQ55VU0GxqFX8xK4c/Case-study--portfolio?node-id=0-1", external: true },
    ],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
