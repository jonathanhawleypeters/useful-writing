// prompt is specific to Anthropic Claude's XML function calling capabilities
export const withPrompt = text => `Usefulness of writing represented in XML by four number properties (0 to 9)

novel
important
correct
strong

Example 1:
<novel>7</novel>
<important>4</important>
<correct>9</correct>
<strong>8</strong>

Example 2:
<novel>0</novel>
<important>8</important>
<correct>6</correct>
<strong>6</strong>

Example 3:
<novel>3</novel>
<important>3</important>
<correct>5</correct>
<strong>9</strong>

Rate the following useing the format.

Writing:
${text}`