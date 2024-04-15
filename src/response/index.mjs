const rating = text => {
  const pattern = /<novel>(?<novel>[0-9])<\/novel>\s*<important>(?<important>[0-9])<\/important>\s*<correct>(?<correct>[0-9])<\/correct>\s*<strong>(?<strong>[0-9])<\/strong>/;
  const matches = text.match(pattern);
  if (!matches || !matches.groups) {
    console.log(`We're looing for something like

<novel>7</novel>
<important>4</important>
<correct>9</correct>
<strong>8</strong>

but we got

${text}`)
    throw new Error('No match found');
  }
  return {
    novel: parseInt(matches.groups.novel, 10),
    important: parseInt(matches.groups.important, 10),
    correct: parseInt(matches.groups.correct, 10),
    strong: parseInt(matches.groups.strong, 10),
  };
}

const format = ({ novel, important, correct, strong }) => 
  `Useful Score

novel: ${novel}
important: ${important}
correct: ${correct}
strong: ${strong}

overall: ${Math.round(novel * important * correct * strong / 9**4 * 100)}%`;

export const formattedRatings = responseText => format(rating(responseText));
