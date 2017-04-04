module.exports = {
  greeting: username => `Good day to you, ${ username }. :beer:`,
  cheers: () => `:beers:`,
  help: username => (`
    Good day to you, ${ username }. :beer:\n
    Try asking me something like:\n
    - What's on tap?\n
    - How much is left?
  `),
  dance: () => `:dancers:`,
  drinkDescription: (name, style, producer) => (
   `- ${ name }, a fine ${ style } produced by ${ producer }.`
  ),
  kegStatus: (name, percent) => {
    let e = ':scream:';
    if (percent > 10) e = ':dizzy_face:';
    if (percent > 20) e = ':cold_sweat:';
    if (percent > 40) e = ':worried:';
    if (percent > 60) e = ':slightly_smiling_face:';
    if (percent > 85) e = ':smile:';
    return `- ${ name } *${ percent.toPrecision(3) }%* remaining! ${ e }`;
  },
  technicalSupport: () => ':electric_plug::zap:Contact technical support!',
};
