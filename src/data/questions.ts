import { MODULE_ORDER } from './moduleOrder';
import { ModuleId, Question } from './types';

const icon = (label: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='80'><rect width='140' height='80' fill='#0f172a'/><text x='8' y='44' fill='#93c5fd' font-size='16'>${label}</text></svg>`;

const MODULE_TITLES: Record<ModuleId, string> = {
  crossing: 'Crossing',
  overtaking: 'Overtaking',
  hierarchy: 'Hierarchy',
  night_lights: 'Night Lights'
};

export const MODULES: { id: ModuleId; title: string }[] = MODULE_ORDER.map((id) => ({
  id,
  title: MODULE_TITLES[id]
}));

export const QUESTION_BANK_VERSION = '1.0.0';

export const QUESTIONS: Question[] = [
  {
    id: 'crossing-1', moduleId: 'crossing', prompt: 'Power-driven vessels are crossing. Target is on your starboard bow. What is your role?',
    choices: [{ id: 'a', text: 'Stand-on vessel' }, { id: 'b', text: 'Give-way vessel' }, { id: 'c', text: 'Restricted vessel' }], correctChoiceId: 'b', media: { kind: 'svg', src: icon('Crossing SBD') },
    explanation: { ruleRefs: ['COLREG Rule 15'], why: 'Vessel with the other on starboard side shall keep out of the way.', commonMistake: 'Assuming bigger vessel is always stand-on.', realWorldAction: 'Alter course early to starboard and pass astern.' }
  },
  {
    id: 'crossing-2', moduleId: 'crossing', prompt: 'As stand-on in crossing, when should you maneuver?',
    choices: [{ id: 'a', text: 'Immediately at first sight' }, { id: 'b', text: 'Only when collision cannot be avoided by give-way alone' }, { id: 'c', text: 'Never maneuver' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 17'], why: 'Stand-on maintains course/speed but must act if give-way is not taking action.' }
  },
  {
    id: 'crossing-3', moduleId: 'crossing', prompt: 'Preferred avoiding action for give-way in crossing?',
    choices: [{ id: 'a', text: 'Small late turn port' }, { id: 'b', text: 'Early substantial action' }, { id: 'c', text: 'Stop in lane' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 8'], why: 'Action shall be positive, made in ample time and with due regard.', commonMistake: 'Tiny heading changes hard to detect.' }
  },
  {
    id: 'crossing-4', moduleId: 'crossing', prompt: 'Crossing with risk of collision exists when:',
    choices: [{ id: 'a', text: 'Bearing remains nearly constant and range decreases' }, { id: 'b', text: 'Target bearing changes rapidly' }, { id: 'c', text: 'Sea state increases' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 7'], why: 'Constant bearing, decreasing distance indicates collision risk.' }
  },
  {
    id: 'crossing-5', moduleId: 'crossing', prompt: 'If unsure whether risk exists in crossing:',
    choices: [{ id: 'a', text: 'Assume no risk' }, { id: 'b', text: 'Assume risk exists' }, { id: 'c', text: 'Call harbor master first' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 7'], why: 'Any doubt should be treated as risk of collision.' }
  },
  {
    id: 'overtaking-1', moduleId: 'overtaking', prompt: 'A vessel coming from >22.5° abaft your beam is:',
    choices: [{ id: 'a', text: 'Crossing vessel' }, { id: 'b', text: 'Overtaking vessel' }, { id: 'c', text: 'Head-on vessel' }], correctChoiceId: 'b', media: { kind: 'svg', src: icon('Abaft beam') },
    explanation: { ruleRefs: ['Rule 13'], why: 'That sector defines overtaking regardless of vessel type.' }
  },
  {
    id: 'overtaking-2', moduleId: 'overtaking', prompt: 'Who keeps out of the way in overtaking?',
    choices: [{ id: 'a', text: 'Vessel being overtaken' }, { id: 'b', text: 'Overtaking vessel' }, { id: 'c', text: 'Both equally' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 13'], why: 'Overtaking vessel must keep clear until finally past and clear.' }
  },
  {
    id: 'overtaking-3', moduleId: 'overtaking', prompt: 'If uncertain whether you are overtaking:',
    choices: [{ id: 'a', text: 'Assume crossing' }, { id: 'b', text: 'Assume overtaking' }, { id: 'c', text: 'Ignore until closer' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 13'], why: 'In doubt, vessel shall assume she is overtaking.' }
  },
  {
    id: 'overtaking-4', moduleId: 'overtaking', prompt: 'Does later bearing change remove overtaking duty?',
    choices: [{ id: 'a', text: 'Yes, once on beam' }, { id: 'b', text: 'No, still overtaking until finally clear' }, { id: 'c', text: 'Only at night' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 13'], why: 'Duty remains until vessel is past and clear.' }
  },
  {
    id: 'overtaking-5', moduleId: 'overtaking', prompt: 'Safe overtaking action should be:',
    choices: [{ id: 'a', text: 'Clear, early, with good CPA' }, { id: 'b', text: 'Close pass to save time' }, { id: 'c', text: 'No need to monitor after maneuver' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 8'], why: 'Avoidance should produce obvious and safe passing distance.', realWorldAction: 'Adjust speed/course to maintain comfortable CPA.' }
  },
  {
    id: 'hierarchy-1', moduleId: 'hierarchy', prompt: 'Which has priority over a power-driven vessel in open waters?',
    choices: [{ id: 'a', text: 'Sailing vessel' }, { id: 'b', text: 'Only larger power vessel' }, { id: 'c', text: 'Hydrofoil only' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 18'], why: 'Power-driven vessel keeps out of the way of sailing vessel (except special cases).' }
  },
  {
    id: 'hierarchy-2', moduleId: 'hierarchy', prompt: 'Top priority in Rule 18 list is generally:',
    choices: [{ id: 'a', text: 'Fishing vessel' }, { id: 'b', text: 'Not under command (NUC)' }, { id: 'c', text: 'Power-driven vessel' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 18'], why: 'NUC has highest practical priority due inability to maneuver.' }
  },
  {
    id: 'hierarchy-3', moduleId: 'hierarchy', prompt: 'Vessel constrained by draught (CBD) treatment:',
    choices: [{ id: 'a', text: 'Always give-way to all' }, { id: 'b', text: 'Small vessels should avoid impeding CBD in narrow channels' }, { id: 'c', text: 'No special considerations' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 9', 'Rule 18'], why: 'CBD has practical limits; others should avoid impeding when applicable.' }
  },
  {
    id: 'hierarchy-4', moduleId: 'hierarchy', prompt: 'A vessel engaged in fishing means:',
    choices: [{ id: 'a', text: 'Any vessel with fish onboard' }, { id: 'b', text: 'Vessel fishing with gear restricting maneuverability' }, { id: 'c', text: 'Trawler only' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 3'], why: 'Definition depends on gear impact on maneuvering ability.' }
  },
  {
    id: 'hierarchy-5', moduleId: 'hierarchy', prompt: 'When two sailing vessels meet, right of way depends primarily on:',
    choices: [{ id: 'a', text: 'Tack/wind side' }, { id: 'b', text: 'Engine horsepower' }, { id: 'c', text: 'Flag state' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 12'], why: 'Port tack keeps clear of starboard tack; windward keeps clear of leeward.' }
  },
  {
    id: 'night_lights-1', moduleId: 'night_lights', prompt: 'Power-driven vessel underway shows:',
    choices: [{ id: 'a', text: 'Red over red only' }, { id: 'b', text: 'Masthead, sidelights, sternlight' }, { id: 'c', text: 'All-round white only' }], correctChoiceId: 'b', media: { kind: 'svg', src: icon('Lights PDV') },
    explanation: { ruleRefs: ['Rule 23'], why: 'Standard navigation lights identify heading and vessel type.' }
  },
  {
    id: 'night_lights-2', moduleId: 'night_lights', prompt: 'Sidelights colors are:',
    choices: [{ id: 'a', text: 'Port green, starboard red' }, { id: 'b', text: 'Port red, starboard green' }, { id: 'c', text: 'Both white' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 21'], why: 'Port is red, starboard is green by convention and COLREG.' }
  },
  {
    id: 'night_lights-3', moduleId: 'night_lights', prompt: 'Two all-round red lights in vertical line indicate:',
    choices: [{ id: 'a', text: 'Vessel not under command' }, { id: 'b', text: 'Pilot vessel on duty' }, { id: 'c', text: 'Towing astern' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 27'], why: 'NUC displays red over red; “captain is dead”.' }
  },
  {
    id: 'night_lights-4', moduleId: 'night_lights', prompt: 'If you see only a white sternlight of another vessel:',
    choices: [{ id: 'a', text: 'You are being overtaken by it' }, { id: 'b', text: 'You are overtaking it' }, { id: 'c', text: 'Head-on situation' }], correctChoiceId: 'b',
    explanation: { ruleRefs: ['Rule 21'], why: 'Sternlight means you are looking at vessel from abaft.' }
  },
  {
    id: 'night_lights-5', moduleId: 'night_lights', prompt: 'At anchor, vessel typically shows:',
    choices: [{ id: 'a', text: 'All-round white anchor light(s)' }, { id: 'b', text: 'Masthead + sidelights' }, { id: 'c', text: 'Flashing yellow only' }], correctChoiceId: 'a',
    explanation: { ruleRefs: ['Rule 30'], why: 'Anchor lights indicate not underway.' }
  }
];
