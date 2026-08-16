/* ==========================================================================
   TGSMUN — ROP Academy scenario quizzes

   SINGLE SOURCE OF TRUTH for both self-tests. rop.html renders the full-screen
   typeform quiz straight off these arrays, so adding, removing or rewording a
   question means editing this file only — no markup changes.

   Shape:
     window.TGSMUN_ROP_QUIZ[<committee key>] = [
       {
         q: "the question",
         opts: [
           { t: "option text", correct: true, why: "why this choice is right" },
           { t: "option text",               why: "why THIS choice fails" },
         ],
       },
     ]

   Every option carries its own `why`, so a wrong answer explains what was
   wrong with that particular choice rather than only naming the right one.

   NOTE — these scenarios are a Secretariat warm-up, not the binding rulebook.
   Have the Executive Board of each committee verify them before publishing.
   ========================================================================== */
window.TGSMUN_ROP_QUIZ = {

  /* ---------------------------------------------------------------- AIPPM */
  aippm: [
    {
      q: "The Moderator opens a sub-topic your leader's party has never taken a public position on. The room expects you to speak. What is the strongest in-portfolio play?",
      opts: [
        { t: "Stay silent to avoid contradicting the party",
          why: "Silence reads as unpreparedness, and abstaining from a sub-topic doesn't protect your portfolio — the Board is watching for judgement, not caution." },
        { t: "Extrapolate from the party's ideology and adjacent voting record", correct: true,
          why: "Reason forward from your party's ideology and its past votes on adjacent issues. That is exactly the reasoning the Executive Board scores — it stays in portfolio even without a quoted position." },
        { t: "Adopt the position of your closest ally bloc verbatim",
          why: "Borrowing an ally's position may be tactically convenient but it surrenders your leader's distinct voice — and a sharp opponent will point out you have no basis for it." },
        { t: "Announce a bold new policy of your own invention",
          why: "Inventing a policy your leader never held is the fastest way to lose portfolio consistency marks, however impressive the speech sounds." },
      ],
    },
    {
      q: "Consensus is forming around a proposal your leader's party genuinely opposes. Refusing outright isolates you; signing betrays the portfolio. What do you do?",
      opts: [
        { t: "Sign the communiqué anyway to stay in the room",
          why: "Signing against your leader's stated position without extracting anything is the clearest portfolio break there is — it costs you more than isolation would." },
        { t: "Walk out of the Meet in protest",
          why: "Walking out surrenders all influence over the final text. Drama is not the same as strategy, and the Meet continues without you." },
        { t: "Negotiate amendments, then file a note of dissent on what remains", correct: true,
          why: "Negotiate amendments or safeguards that make the text signable, and record a note of dissent on what you still reject. You stay in the room, shape the outcome, and keep the portfolio intact." },
        { t: "Block the communiqué entirely without offering an alternative",
          why: "Blocking without an alternative just makes you an obstacle. The Meet is scored on your contribution to a workable outcome, not your ability to stall one." },
      ],
    },
    {
      q: "A delegate quotes a statistic that you know is fabricated, and the room is starting to accept it. What is the sharpest response?",
      opts: [
        { t: "Challenge the source and supply the correct figure with its citation", correct: true,
          why: "Challenge the source directly and substitute the real figure with your citation. Factual accountability is a scored skill — and doing it in portfolio is exactly what the format rewards." },
        { t: "Attack the delegate's credibility rather than the number",
          why: "Attacking the person rather than the claim hands them the moral high ground and tells the Board you couldn't rebut the substance." },
        { t: "Ignore it — it isn't your sub-topic",
          why: "Letting a false figure stand means the communiqué may be built on it. Silence here is a missed opportunity, not diplomacy." },
        { t: "Counter with a more impressive statistic of your own",
          why: "Matching a fabrication with your own destroys your credibility for the rest of the Meet, and the Press will note both." },
      ],
    },
    {
      q: "Which of these is a genuine procedural break in AIPPM, rather than merely a weak move?",
      opts: [
        { t: "Interrupting rivals aggressively during deliberation",
          why: "Aggressive interjections are native to AIPPM — the format is built for sharp exchange. Being combative isn't a procedural violation." },
        { t: "Forming a bloc with a rival party",
          why: "Cross-party blocs are actively encouraged; the joint communiqué usually depends on them forming." },
        { t: "Arguing your own personal views instead of your leader's", correct: true,
          why: "Speaking as yourself — a student with personal opinions — rather than as your allotted leader breaks the core rule of a portfolio committee. Everything else listed is legitimate play." },
        { t: "Refusing to sign the final communiqué",
          why: "Refusing to sign is a legitimate outcome, provided you record your dissent. Dissent is built into the format." },
      ],
    },
    {
      q: "The International Press publishes a report that quotes you accurately but frames your position damagingly. What is the best play?",
      opts: [
        { t: "Demand the Press retract the report",
          why: "Demanding a retraction of an accurate quote is a losing fight — and it signals you can't defend your own words." },
        { t: "Clarify the framing on the floor and offer a sharper quote", correct: true,
          why: "Address the framing on the floor and give the Press a sharper, clearer line to carry next. Working the coverage is part of playing a politician well." },
        { t: "Ignore it entirely and carry on",
          why: "Ignoring hostile coverage lets the framing harden. In a committee the Press actively covers, that's a strategic cost." },
        { t: "Attack the Press's legitimacy in your next intervention",
          why: "Attacking the Press as an institution is a distraction from your agenda, and the Board notices when a delegate spends the floor on grievance." },
      ],
    },
    {
      q: "Two delegates make identical points. One gets the Best Delegate nod. What most likely separated them?",
      opts: [
        { t: "Whoever spoke for longer overall",
          why: "Total speaking time is not the metric. A delegate can dominate the clock and still contribute nothing to the outcome." },
        { t: "Whoever spoke more forcefully",
          why: "Volume and force of delivery help you hold a room, but they don't distinguish two delegates making the same argument." },
        { t: "Evidence, portfolio consistency, and turning the point into agreed text", correct: true,
          why: "The delegate who sourced the claim, kept it consistent with their leader's record, and converted it into text others signed did more with the same point." },
        { t: "Whoever raised it first",
          why: "Speaking first is a small advantage at best; it can't outweigh research and the ability to build consensus around the point." },
      ],
    },
  ],

  /* ------------------------------------------------------------------ NBA */
  nba: [
    {
      q: "You hold the last pick of a snake round, which means you also pick first in the next. Two elite guards remain and no elite centre. What is the strongest use of that double pick?",
      opts: [
        { t: "Take both guards — best player available, twice",
          why: "Taking both guards ignores that you control consecutive picks — you can afford to address a different need first and still very likely land one of them." },
        { t: "Take the scarcer position first, banking that one guard survives", correct: true,
          why: "The back-to-back pick is leverage: fill the scarcer need now, because the odds are good one of two comparable guards survives a single opposing pick." },
        { t: "Pass on the pick to preserve flexibility",
          why: "Passing a pick is never rewarded — you simply lose an asset, and the Board scores roster construction, not restraint." },
        { t: "Trade the pick away for a future round",
          why: "Trading down from a double pick gives away exactly the advantage that makes it valuable, usually for less than it's worth." },
      ],
    },
    {
      q: "The crisis desk announces a career-ending injury to your best player mid-draft. What is the strongest response?",
      opts: [
        { t: "Dispute the update with the Executive Board",
          why: "Disputing a crisis update rarely works — the desk's updates are the committee's reality, and arguing with them burns floor time." },
        { t: "Rebuild the rotation around your remaining core and re-argue the roster", correct: true,
          why: "Adaptability is explicitly scored. Rebuild around what you still have and argue the new roster on its merits — the GMs who absorb a crisis best usually win the room." },
        { t: "Continue defending the original roster as though nothing changed",
          why: "Carrying on as though nothing happened means your defence relies on a player the committee knows is gone — opponents will dismantle it immediately." },
        { t: "Immediately trade away the rest of your core",
          why: "Panic-trading from a weak position is how GMs get fleeced. The crisis is a test of composure, not a signal to dump assets." },
      ],
    },
    {
      q: "An opponent argues your 1960s pick is inflated because the league was smaller and less athletic. What is the strongest rebuttal?",
      opts: [
        { t: "Quote the player's raw career totals",
          why: "Raw totals are exactly what the era objection targets — quoting bigger numbers from a different context doesn't answer the argument." },
        { t: "Argue dominance relative to their own era, and why the skills translate", correct: true,
          why: "Answer era with era: dominance relative to peers, plus the case that elite skills and competitive instinct translate. That engages the actual objection instead of talking past it." },
        { t: "Attack the era of their own best pick instead",
          why: "Attacking a modern pick may score a point elsewhere but leaves the charge against your own player standing." },
        { t: "Concede the point and pivot to another player",
          why: "Conceding costs you the pick's value for the rest of the committee, and you'll be defending a discounted roster at the vote." },
      ],
    },
    {
      q: "What exactly makes this a semi-crisis committee rather than a full crisis?",
      opts: [
        { t: "There are no rules at all",
          why: "There are certainly rules — the draft order, trade windows and defence rounds are all structured." },
        { t: "A structured draft backbone with crisis injections between rounds", correct: true,
          why: "A structured draft is the backbone, and the crisis desk injects twists between rounds. Neither pure debate nor pure crisis — the two alternate." },
        { t: "Debate is optional",
          why: "Debate is central — every pick has to be defended on the floor. That's half the scoring." },
        { t: "It runs for only half a session",
          why: "Session length has nothing to do with the crisis classification." },
      ],
    },
    {
      q: "A rival offers you two good players for your one superstar, and your roster is thin. Spot the flaw in accepting reflexively.",
      opts: [
        { t: "Trades are against the rules",
          why: "Trades are explicitly permitted between rounds — volume itself isn't the problem." },
        { t: "Depth doesn't outweigh a lost ceiling — quality is what's scored", correct: true,
          why: "Roster ceiling is judged on peak quality, not headcount. Two good players rarely replicate what one all-time great does, so the trade has to be argued on quality, not quantity." },
        { t: "You can't trade with a direct rival",
          why: "You may absolutely trade with a rival; alliances of convenience are part of the format." },
        { t: "The roster can't change identity mid-draft",
          why: "Nothing prevents a trade from changing your roster's identity — reinvention is legitimate if you can defend it." },
      ],
    },
    {
      q: "Two GMs finish with statistically comparable rosters. What most likely decides the verdict?",
      opts: [
        { t: "Highest combined career points",
          why: "Combined career points is a blunt measure that ignores fit, era and role — and the Board explicitly scores more than totals." },
        { t: "Whoever picked earlier in round one",
          why: "Draft position is a starting condition, not an achievement. It doesn't decide the verdict on its own." },
        { t: "Roster balance, quality of defence, and adaptation to crises", correct: true,
          why: "Balance, the quality of the defence on the floor, and how well each GM adapted to crisis updates are the stated criteria — that's what separates comparable rosters." },
        { t: "Whoever made the most trades",
          why: "Trade volume is a tactic, not a goal. Plenty of winning rosters make no trades at all." },
      ],
    },
  ],
};
