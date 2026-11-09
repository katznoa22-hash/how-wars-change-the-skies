Product Requirements Document (PRD)

Project: How Wars Change the Skies
Subtitle: An Interactive Exploration of Conflict, Airspace Closures, and Global Aviation
Version: 1.0 — Initial Draft
Date: November 5, 2026
Status: Proposed for Team Review

1. Executive Summary

How Wars Change the Skies is an interactive, web-based educational presentation exploring how geopolitical conflicts disrupt commercial aviation.

The project combines a 3D interactive globe, historical case studies, flight route comparisons, Python-based calculations, and an airline decision-making simulator.

Instead of simply presenting information, the experience allows users to explore how hypothetical airspace restrictions influence flight distance, estimated travel time, operating costs, and airline decisions.

The project will demonstrate both technical implementation and independent managerial thinking.

2. Problem Statement

International aviation depends on access to interconnected airspace networks. Armed conflicts and geopolitical tensions may create restrictions that disrupt established flight routes.

These disruptions can create several challenges:

Longer alternative flight routes.

Increased fuel consumption and operating costs.

Longer estimated travel times.

Flight cancellations and scheduling difficulties.

Reduced connectivity between regions.

Difficult operational decisions for airlines.

Traditional presentations describe these impacts but rarely allow users to explore them interactively.

Our project addresses this gap through visualization, calculation, and decision-making.

3. Project Objectives

Explain how armed conflicts can affect civilian airspace access.

Visualize commercial flight routes on an interactive 3D globe.

Compare original routes with hypothetical alternative routes.

Calculate estimated changes in distance, duration, and operating costs using Python.

Allow users to make airline management decisions and observe their consequences.

Demonstrate the integration of HTML, CSS, JavaScript, Three.js, and Python.

Present historical information accurately and distinguish it from modeled assumptions.

Deliver a professional, visually appealing, and accessible educational experience.

4. Target Audience

University students studying technology and management.

Individuals interested in aviation and international affairs.

People interested in the economic impact of geopolitical events.

Educators seeking interactive learning tools.

No prior aviation knowledge should be required.

5. Project Scope

In Scope

Approximately 10 interactive presentation slides.

An animated 3D globe.

Historical case studies.

Hypothetical airspace closure scenarios.

Interactive route comparisons.

Python-generated analytical results.

An airline management decision simulator.

Interactive charts and visual explanations.

Documented assumptions and references.

GitHub documentation and prompt history.

Out of Scope

Real-time flight tracking.

Live military or defense monitoring.

Actual flight planning or operational navigation.

Prediction of military operations.

Real-time conflict risk assessment.

Claims that simulated routes are approved or operationally safe.

6. Historical Case Studies

Case Study A: Russia–Ukraine War

Explore the impact of airspace restrictions associated with the Russia–Ukraine war on commercial aviation, including changes to connectivity between Europe and Asia.

The presentation will use verified historical sources and illustrative route comparisons.

Case Study B: Middle East Conflicts

Explore how regional conflicts and temporary airspace restrictions can disrupt commercial flights through the Middle East.

The presentation will focus on civilian aviation consequences rather than military operations.

Comparative Analysis

The two case studies will be compared across:

Geographic scope.

Types of aviation disruption.

Potential rerouting consequences.

Economic implications.

Airline management challenges.

Historical claims must be supported by credible references.

7. Presentation Structure

Slide 1 — How Wars Change the Skies

Purpose: Introduce the project and capture the audience's attention.

Features:

Animated title.

Aviation-inspired background.

Rotating 3D Earth preview.

Start Exploration button.

Slide 2 — The Invisible Highways of the Sky

Purpose: Explain why airspace connectivity matters.

Features:

Global commercial aviation network visualization.

Explanation of flight routes and airspace.

Interactive information cards.

Slide 3 — What Happens When Airspace Closes?

Purpose: Explain the relationship between conflict and civilian aviation restrictions.

Features:

Step-by-step educational explanation.

Interactive airspace status illustration.

Comparison between normal and restricted scenarios.

Slide 4 — Two Conflicts, Global Consequences

Purpose: Introduce the two historical case studies.

Features:

Russia–Ukraine case study.

Middle East case study.

Interactive case study selection.

Timeline and source references.

Slide 5 — The Flight Rerouting Challenge

Purpose: Demonstrate how an airspace restriction may change a flight route.

Features:

Select an illustrative origin and destination.

Compare baseline and hypothetical alternative routes.

Highlight changes in distance.

Display explanatory assumptions.

Slide 6 — Explore the 3D Globe

Purpose: Provide the main interactive visual experience.

Features:

Rotating Earth using Three.js.

Mouse-controlled rotation and zoom.

Animated commercial flight route arcs.

Scenario selection.

Different visual styles for baseline and alternative routes.

Reset View button.

Slide 7 — The Hidden Cost of a Detour

Purpose: Demonstrate the economic consequences of longer routes.

Features:

Python-generated distance calculations.

Estimated additional flight time.

Estimated additional operating cost.

Interactive comparison charts.

Clearly displayed assumptions.

Slide 8 — Airlines Under Pressure

Purpose: Explain the managerial implications of aviation disruptions.

Features:

Operating cost considerations.

Passenger disruption.

Schedule reliability.

Network connectivity.

Interactive comparison of managerial priorities.

Slide 9 — You Are the Airline Manager

Purpose: Allow the user to make decisions in a simulated disruption.

Features:

Choose a hypothetical aviation disruption scenario.

Compare predefined response options.

Adjust selected economic assumptions.

Evaluate estimated costs, delays, and operational consequences.

Receive explanatory feedback based on the selected decision.

The simulator must not suggest that financial optimization alone determines real-world flight safety. All simulated options must be clearly labeled as illustrative.

Slide 10 — The Future of Aviation Resilience

Purpose: Summarize the main findings and lessons.

Features:

Key insights.

Managerial recommendations.

Limitations of the analysis.

Future research opportunities.

Sources and credits.

8. Functional Requirements

FR-01 — Slide Navigation

Users must be able to navigate between slides using visible navigation buttons.

Keyboard navigation should also be supported.

FR-02 — Interactive 3D Globe

The application must display a functioning, animated 3D Earth using Three.js.

Users should be able to rotate the globe, zoom, and reset the camera.

FR-03 — Scenario Selection

Users must be able to select between at least two illustrative aviation disruption scenarios.

FR-04 — Route Comparison

The application must visually distinguish baseline routes from hypothetical alternative routes.

FR-05 — Python Analysis

A Python script must calculate:

Great-circle distances between selected airports.

Distances of alternative routes using defined waypoints.

Estimated additional distance.

Estimated additional flight time.

Estimated incremental operating costs.

FR-06 — Interactive Decision Simulator

Users must be able to select different hypothetical airline management responses and view calculated consequences.

FR-07 — Data Visualization

The application must include readable charts showing the effects of selected scenarios.

FR-08 — Source Transparency

Historical claims must include references.

Modeled values must be clearly labeled as assumptions or estimates.

FR-09 — User Feedback

Buttons, selectors, and controls must provide visible feedback when activated.

FR-10 — Error Handling

The application must handle missing data or invalid inputs without crashing.

9. Technical Architecture

HTML

The primary presentation will be implemented in a central index.html file.

CSS

CSS will define the layout, typography, visual hierarchy, animations, and responsive presentation design.

JavaScript

JavaScript will manage slide navigation, interactive controls, scenario selection, charts, and visual updates.

Three.js

Three.js will provide the animated 3D Earth and illustrative flight paths.

Python

Python will generate analytical data through a reproducible script.

The script will use documented formulas and assumptions and export results to JSON.

JavaScript will load these generated results into the presentation.

Python does not need to execute inside the browser.

GitHub

The GitHub repository will contain the application, Python script, generated data, PRD, README, source references, and documented AI prompts.

10. Analytical Model

Distance Calculation

The model will use the Haversine formula to estimate great-circle distances between geographic coordinates.

Alternative route distances will be approximated by summing distances between predefined waypoints.

Estimated Flight Time

Estimated flight time will be calculated using:

Flight Time = Route Distance / Assumed Average Ground Speed

This simplified model excludes several real-world variables.

Incremental Operating Cost

Estimated additional operating cost will be calculated using:

Additional Cost = Additional Flight Hours × Assumed Hourly Operating Cost

All economic parameters will be illustrative and configurable.

Analytical Limitations

The model will not represent certified flight planning.

It will not account fully for weather, winds, aircraft-specific performance, air traffic control requirements, airport constraints, or all applicable restrictions.

The simulator is intended for educational comparison only.

11. Visual Design Requirements

Design Direction

Professional aviation intelligence dashboard.

Color Palette

Deep navy background.

Blue and cyan highlights.

White or light-gray typography.

Amber for selected warning indicators.

Distinct contrasting colors for compared routes.

Visual Style

Modern dashboard-inspired layout.

Clear typography and visual hierarchy.

Smooth transitions.

Interactive maps and charts.

Consistent navigation.

Minimal unnecessary text.

Accessibility

Sufficient text contrast.

Readable labels.

Keyboard-accessible navigation.

Alternative text or descriptions for essential visuals.

Reduced-motion support where practical.

12. Non-Functional Requirements

NFR-01 — Performance

The presentation should remain responsive during normal navigation and 3D interaction on a modern desktop browser.

NFR-02 — Reliability

All required interactions must work without critical JavaScript errors.

NFR-03 — Usability

Users must understand how to navigate the presentation without additional instructions.

NFR-04 — Maintainability

Code and analytical assumptions must be organized and documented.

NFR-05 — Reproducibility

The Python calculations must be reproducible from the included source files.

NFR-06 — Offline and Dependency Transparency

The README must explain whether an internet connection is required for external libraries or assets.

13. Acceptance Criteria

The project will be considered ready for submission when:

Approximately 10 slides are implemented.

Slide navigation functions correctly.

The 3D globe renders and animates successfully.

Users can interact with the globe.

At least two aviation disruption scenarios are available.

Route comparisons update correctly.

Python calculations run successfully and generate usable outputs.

The decision simulator responds to user selections.

Historical claims have references.

Assumptions and limitations are clearly stated.

The README includes project screenshots and operating instructions.

The repository contains the PRD and actual AI prompt history.

Several meaningful development commits and pushes are visible.

The repository is accessible to the instructor.

14. Development Plan

Phase 1 — Requirements and Planning

Finalize the project concept, PRD, scenarios, and design direction.

Phase 2 — Initial HTML Presentation

Build the first working presentation with navigation and slide content.

Phase 3 — 3D Visualization

Implement and test the interactive globe and illustrative flight paths.

Phase 4 — Python Analysis

Develop and validate the distance, time, and cost calculations.

Phase 5 — Interactive Simulator

Integrate user decisions with calculated outcomes.

Phase 6 — Testing and Refinement

Review functionality, factual accuracy, accessibility, usability, and visual quality.

Phase 7 — Documentation and Submission

Complete the README, prompt history, screenshots, GitHub repository, and submission materials.

15. Risks and Mitigation

Risk

Mitigation

Historical information is inaccurate

Verify claims using credible sources

Simulated routes are mistaken for real routes

Clearly label scenarios as hypothetical

3D visualization performs poorly

Limit visual complexity and provide fallback messaging

Python and JavaScript results differ

Use one documented calculation model and test outputs

Project becomes too complex

Prioritize core requirements before optional features

Development history is incomplete

Save actual prompts and meaningful commits throughout development

16. Success Metrics

Success will be evaluated through:

Completion of required technical features.

Correctness and clarity of the educational content.

Functionality of the interactive elements.

Transparency of the analytical model.

Quality of the visual experience.

Evidence of iterative AI-assisted development.

Clear demonstration of independent critical thinking.

17. Planned Repository Structure

how-wars-change-the-skies/
├── index.html
├── analysis.py
├── data/
│   └── scenarios.json
├── assets/
│   └── screenshots/
├── prompts/
│   ├── 01-planning.md
│   ├── 01-chatgpt-conversation.md
│   └── development-prompts.md
├── PRD.md
├── README.md
└── .gitignore

18. Open Decisions

The team must review and approve:

Which historical events and dates will be included.

Which illustrative airport pairs will be used.

Which route assumptions will be modeled.

Which economic assumptions will be used.

The final design style and interaction priorities.

Whether additional features can be completed within the available time.

19. Final Project Vision

How Wars Change the Skies aims to transform a complex geopolitical and economic topic into an engaging educational experience.

By combining visual storytelling, 3D interaction, reproducible Python analysis, and managerial decision-making, the project will demonstrate how AI-assisted development can support both technical creativity and critical thinking.

End of PRD — Version 1.0


---
## Version 4 as-built addendum — 9 November 2026

The initial draft above is preserved as historical planning, not an invented instructor rubric. This addendum records the actual submission candidate developed with Codex. Release status: local version-4 branch; manual review and publication approval pending. The user's cinematic navy/pearl/cyan directive supersedes the earlier V4 gold proposal recorded in prompts/codex-development-v4.md.

| Slide | Implemented scope |
| --- | --- |
| 1 | Text-free generated cinematic Earth/aircraft artwork; real HTML title, exact subtitle and native Start button; labelled modeled hero figures and illustrative-image disclosure. |
| 2 | Three explanatory panels: great-circle reference, sovereign airspace and FIRs; legal citation and causal chain. This is not an interactive global network explorer. |
| 3 | Four operational steps, baseline/illustrative-detour comparison and dated EASA reference. No live closure simulation or status feed. |
| 4 | Two keyboard-accessible case buttons with programmatic selected state; operator-specific Finnair example and dated April 2024 event. No invented timeline. |
| 5 | Three reproducible hypothetical waypoint routes, zero-origin comparison bars, four metrics, units/formulas and globe synchronization. |
| 6 | Functional 3D globe with country context, three routes, airport labels, reset/zoom/drag/keyboard/pause; shared-data 2D fallback and disabled-control explanations. |
| 7 | Native fuel/hour sliders, route-hour transfer/reset, component cost chart, annual identical-sector assumption and direct CO2, with formulas/exclusions. |
| 8 | Four managerial-interpretation briefing cards; safety/legal prerequisites. No claim of interactive priority weighting. |
| 9 | Two scenarios, four responses and three prices (48 combinations), modeled incremental costs, invented scores, explanatory feedback and expandable comparison/assumptions. |
| 10 | Synthesis and three recommendations, source register, limitations, credits and Return to Start. |

Constraints retained: exactly ten ordered English slides; existing validated data/model assumptions/citations; no new runtime dependency or network requirement; visible keyboard focus, inert inactive slides, reduced motion and responsive scrolling. Larger targets and captions are prioritized over decoration. Sources and models have different evidence status; invented simulator scores do not establish safety, legality or profitability. Final acceptance requires the actual executed checks and manual review described in the V4 log, not merely this scope table.


Pre-release verification addendum: the original nine Python checks were rerun successfully, then narrowly strengthened to 12 checks (nine model, three Git-history) for numerical reproducibility across float summation implementations. Only derived-number test comparisons use explicit absolute tolerances; validated data, inputs and formulas remain unchanged. Source-only ZIP reviewers must use the explicit ModelChecks command in README and cannot verify release history without .git. Browser regression remains 29 groups / 48 simulator combinations / 30 projector layouts. Physical projection, assistive technology and a second platform remain manual limitations. Exact independent ZIP-error reconciliation is pending the reviewer's traceback/environment; no definitive cross-platform diagnosis is asserted.
